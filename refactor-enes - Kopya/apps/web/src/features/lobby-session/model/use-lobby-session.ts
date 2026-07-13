// The only slice that talks to the lobby WebSocket. A small session class
// owns the socket and the reconnect machinery (3 redials at 1s/2s/4s while
// the tab lives) and feeds every parsed server message through a pure
// reducer; the hook surfaces the snapshot via useSyncExternalStore and hands
// peer moves to the caller through a latest-ref callback. SSR-safe: nothing
// dials until a client-side create() or join(), and the server snapshot is
// the inert idle state.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { PlayerIndex } from "@/entities/game";
import { generateLobbyCode, isValidLobbyCode } from "@/shared/lib/lobby-code";
import {
  type ClientMessage,
  type LobbyErrorReason,
  parseServerMessage,
  type ServerMessage,
} from "@/shared/lib/lobby-protocol";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLobbySession(
  options: UseLobbySessionOptions = {},
): UseLobbySession {
  const onPeerMoveRef = useRef(options.onPeerMove);
  const [session] = useState(
    () =>
      new LobbySession((payload, player) =>
        onPeerMoveRef.current?.(payload, player),
      ),
  );

  // Latest-ref: relayed moves always reach the newest render's callback.
  useEffect(() => {
    onPeerMoveRef.current = options.onPeerMove;
  });

  // The session dies with the component — no socket or timer outlives it.
  useEffect(() => () => session.dispose(), [session]);

  const state = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () => ({
      state,
      create: session.create,
      join: session.join,
      sendMove: session.sendMove,
      sendRematch: session.sendRematch,
      sendStart: session.sendStart,
      leave: session.leave,
    }),
    [session, state],
  );
}

// ── Reducer (pure — unit-tested without a socket) ─────────────────────────────

/** Pure state transitions; the session class adds sockets and timers on top. */
export function reduceSession(
  state: LobbySessionState,
  event: LobbySessionEvent,
): LobbySessionState {
  switch (event.kind) {
    case "dial":
      return { phase: "connecting", code: event.code, attempt: 0 };
    case "message":
      return applyServerMessage(state, event.message);
    case "socket-closed": {
      if (
        state.phase === "idle" ||
        state.phase === "closed" ||
        state.phase === "error"
      ) {
        return state; // already settled — nothing to recover
      }
      const attempt = state.phase === "connecting" ? state.attempt : 0;
      return attempt >= MAX_RECONNECT_ATTEMPTS
        ? sessionError("connection")
        : { phase: "connecting", code: state.code, attempt: attempt + 1 };
    }
    case "leave":
      return state.phase === "idle" ? state : { phase: "closed" };
  }
}

/** Parsed DO messages → phase changes (peer-move is a side channel, not state). */
function applyServerMessage(
  state: LobbySessionState,
  message: ServerMessage,
): LobbySessionState {
  switch (message.t) {
    case "waiting":
      // Initial wait (from connecting) OR update when someone joins/leaves while waiting
      if (state.phase === "connecting") {
        return {
          phase: "waiting",
          code: message.code,
          names: message.names,
          you: message.you,
        };
      }
      if (state.phase === "waiting") {
        return { ...state, names: message.names, you: message.you };
      }
      return state;
    case "start":
      // Reached from connecting (guest), waiting (host), peer-left (a rejoin
      // restarts with a fresh seed), or playing (peer reconnected mid-game).
      return state.phase === "idle" ||
        state.phase === "closed" ||
        state.phase === "error"
        ? state
        : {
            phase: "playing",
            code: state.code,
            seed: message.seed,
            names: message.names,
            you: message.you,
          };
    case "rematch-start":
      return state.phase === "playing"
        ? { ...state, seed: message.seed }
        : state;
    case "peer-left":
      return state.phase === "playing"
        ? {
            phase: "peer-left",
            code: state.code,
            names: state.names,
            you: state.you,
          }
        : state;
    case "error":
      return sessionError(message.reason);
    case "peer-move":
      return state;
  }
}

function sessionError(reason: LobbySessionErrorReason): LobbySessionState {
  return { phase: "error", reason, message: SESSION_ERROR_MESSAGES[reason] };
}

// ── Session (socket + reconnect machinery behind the store) ───────────────────

class LobbySession {
  private state: LobbySessionState = INITIAL_SESSION_STATE;
  private readonly listeners = new Set<() => void>();
  private socket: WebSocket | null = null;
  private redialTimer: ReturnType<typeof setTimeout> | null = null;
  private dialParams: DialParams | null = null;

  constructor(
    private readonly onPeerMove: (payload: unknown, player: number) => void,
  ) {}

  // Public surface as arrow properties — safe to pass around unbound.

  readonly subscribe = (onChange: () => void): (() => void) => {
    this.listeners.add(onChange);
    return () => this.listeners.delete(onChange);
  };

  readonly getSnapshot = (): LobbySessionState => this.state;

  /** Host flow: mint a code client-side and claim its room as seat 0. */
  readonly create = (options: { name: string; game: string }): void => {
    this.dial({
      code: generateLobbyCode(),
      name: options.name,
      game: options.game,
      joinOnly: false,
    });
  };

  /** Guest flow: dial an existing code (`join=1` keeps dead rooms dead). */
  readonly join = (options: {
    code: string;
    name: string;
    game: string;
  }): void => {
    const code = options.code.trim().toUpperCase();
    if (!isValidLobbyCode(code)) {
      // The Worker would 404 this upgrade anyway; fail fast with the same
      // stable message instead of burning three doomed redials.
      this.teardown();
      this.dialParams = null;
      this.dispatch({
        kind: "message",
        message: { t: "error", reason: "not-found" },
      });
      return;
    }
    this.dial({ code, name: options.name, game: options.game, joinOnly: true });
  };

  readonly sendMove = (payload: unknown): void => {
    this.send({ t: "move", payload });
  };

  readonly sendRematch = (): void => {
    this.send({ t: "rematch" });
  };

  /** Host only: requests the Durable Object to start the match. */
  readonly sendStart = (): void => {
    this.send({ t: "start" });
  };

  readonly leave = (): void => {
    this.dialParams = null;
    this.send({ t: "leave" });
    this.teardown();
    this.dispatch({ kind: "leave" });
  };

  /** Unmount cleanup: drop socket, timer, and subscribers — no dispatch. */
  readonly dispose = (): void => {
    this.dialParams = null;
    this.teardown();
    this.listeners.clear();
  };

  private dial(params: DialParams): void {
    if (typeof window === "undefined") return; // SSR: never dial on the server
    this.teardown();
    this.dialParams = params;
    this.dispatch({ kind: "dial", code: params.code });
    this.openSocket();
  }

  private openSocket(): void {
    const params = this.dialParams;
    if (params === null) return;
    const ws = new WebSocket(buildSocketUrl(params));
    this.socket = ws;
    ws.addEventListener("message", (event) => {
      if (ws === this.socket) this.receive(event.data);
    });
    ws.addEventListener("close", () => {
      if (ws !== this.socket) return; // superseded or torn down — stale event
      this.socket = null;
      this.recover();
    });
  }

  private receive(data: unknown): void {
    const message = parseServerMessage(
      typeof data === "string" ? parseJson(data) : null,
    );
    if (message === null) return; // parse-don't-cast: ill-formed is dropped
    if (message.t === "peer-move") {
      this.onPeerMove(message.payload, message.from); // side channel, not reducer state
      return;
    }
    this.dispatch({ kind: "message", message });
  }

  /** Capped backoff while the tab lives: redial after 1s/2s/4s, then error. */
  private recover(): void {
    this.dispatch({ kind: "socket-closed" });
    const state = this.state;
    if (state.phase !== "connecting" || state.attempt === 0) return;
    const delay = RECONNECT_DELAYS_MS[state.attempt - 1];
    this.redialTimer = setTimeout(() => {
      this.redialTimer = null;
      this.openSocket();
    }, delay);
  }

  private send(message: ClientMessage): void {
    const ws = this.socket;
    if (ws !== null && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /** Silence and drop the current socket plus any pending redial. */
  private teardown(): void {
    if (this.redialTimer !== null) {
      clearTimeout(this.redialTimer);
      this.redialTimer = null;
    }
    const ws = this.socket;
    if (ws === null) return;
    this.socket = null; // handlers compare identity, so stale events no-op
    ws.close(1000);
  }

  private dispatch(event: LobbySessionEvent): void {
    const next = reduceSession(this.state, event);
    if (next === this.state) return;
    this.state = next;
    for (const listener of this.listeners) {
      listener();
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getServerSnapshot(): LobbySessionState {
  return INITIAL_SESSION_STATE;
}

/** ws(s)://<host>/lobi/:code?name=…&game=…[&join=1] from window.location. */
function buildSocketUrl(params: DialParams): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = new URL(
    `${protocol}//${window.location.host}/lobi/${params.code}`,
  );
  url.searchParams.set("name", params.name);
  url.searchParams.set("game", params.game);
  if (params.joinOnly) url.searchParams.set("join", "1");
  return url.toString();
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const INITIAL_SESSION_STATE: LobbySessionState = { phase: "idle" };

/** Stable Turkish copy the UI renders verbatim from `state.message`. */
const SESSION_ERROR_MESSAGES: Record<LobbySessionErrorReason, string> = {
  "not-found": "Lobi bulunamadı",
  full: "Lobi dolu",
  "name-required": "Takma ad gerekli",
  connection: "Bağlantı koptu",
};

/** Redial attempt N waits RECONNECT_DELAYS_MS[N - 1]; after the last, error. */
const RECONNECT_DELAYS_MS = [1000, 2000, 4000];
const MAX_RECONNECT_ATTEMPTS = RECONNECT_DELAYS_MS.length;

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * idle → connecting → waiting (host shows the shareable code) → playing →
 * peer-left | closed | error. `connecting.attempt` is 0 on the first dial and
 * 1..3 on redials; peer-left keeps the room alive so a rejoin (fresh `start`)
 * returns to playing.
 */
export type LobbySessionState =
  | { phase: "idle" }
  | { phase: "connecting"; code: string; attempt: number }
  | { phase: "waiting"; code: string; names: string[]; you: number }
  | {
      phase: "playing";
      code: string;
      seed: number;
      names: string[];
      you: PlayerIndex;
    }
  | {
      phase: "peer-left";
      code: string;
      names: string[];
      you: PlayerIndex;
    }
  | { phase: "closed" }
  | { phase: "error"; reason: LobbySessionErrorReason; message: string };

/** Protocol rejections plus the client-side "ran out of redials" case. */
export type LobbySessionErrorReason = LobbyErrorReason | "connection";

/** Reducer inputs — produced by the session class, never by the UI. */
export type LobbySessionEvent =
  | { kind: "dial"; code: string }
  | { kind: "message"; message: ServerMessage }
  | { kind: "socket-closed" }
  | { kind: "leave" };

export interface UseLobbySessionOptions {
  /** Called with every relayed peer move — a side channel, not in `state`. */
  onPeerMove?(payload: unknown, player: number): void;
}

export interface UseLobbySession {
  state: LobbySessionState;
  /** Generates a lobby code and connects as the host. */
  create(options: { name: string; game: string }): void;
  /** Connects to an existing lobby code (normalized to uppercase). */
  join(options: { code: string; name: string; game: string }): void;
  sendMove(payload: unknown): void;
  sendRematch(): void;
  /** Host only: requests the match to start. */
  sendStart(): void;
  leave(): void;
}

/** Everything needed to (re)dial the same room with the same identity. */
interface DialParams {
  code: string;
  name: string;
  game: string;
  joinOnly: boolean;
}
