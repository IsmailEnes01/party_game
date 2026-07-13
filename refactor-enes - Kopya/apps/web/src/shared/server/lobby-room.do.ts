import { DurableObject } from "cloudflare:workers";
import { isValidLobbyCode } from "@/shared/lib/lobby-code";
import {
  type LobbyErrorReason,
  parseClientMessage,
  type ServerMessage,
} from "@/shared/lib/lobby-protocol";

/** Max players per lobby: 1 host + 10 joins = 11 total. */
const MAX_PLAYERS = 11;

// Game-agnostic relay room — one instance per lobby code (idFromName). Uses
// the WebSocket Hibernation API: every seat is mirrored into its socket's
// attachment so the constructor can rebuild `this.seats` after a wake-up.
// Lifecycle: waiting (1 seat) → playing (2–11 seats) → empty when all leave.
// The room never interprets moves; both clients run the same pure reducer
// over the relayed stream, seeded by the number broadcast in `start`.
export class LobbyRoom extends DurableObject<Env> {
  /** Live sockets → seats; restored from attachments after hibernation. */
  private seats = new Map<WebSocket, Seat>();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    for (const ws of ctx.getWebSockets()) {
      const seat = ws.deserializeAttachment() as Seat | null;
      if (seat) this.seats.set(ws, seat);
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket bekleniyor", { status: 426 });
    }

    const url = new URL(request.url);
    const code = (url.pathname.split("/").pop() ?? "").toUpperCase();
    const name = url.searchParams.get("name")?.trim() ?? "";
    const joinOnly = url.searchParams.get("join") === "1";

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    if (name === "") return rejectSocket(client, server, "name-required");
    if (this.seats.size >= MAX_PLAYERS)
      return rejectSocket(client, server, "full");
    if (this.seats.size === 0 && joinOnly) {
      // Strict-join connect to a room whose host is gone (or never existed):
      // refuse instead of silently resurrecting the lobby as its host.
      return rejectSocket(client, server, "not-found");
    }

    const taken = new Set([...this.seats.values()].map((seat) => seat.index));
    let index = 0;
    while (taken.has(index)) index++;
    const seat: Seat = { index, name };
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(seat);
    this.seats.set(server, seat);

    // Everyone gets "waiting" - host will start the game manually
    const names: string[] = new Array(this.seats.size).fill("");
    for (const seat of this.seats.values()) {
      names[seat.index] = seat.name;
    }
    for (const [ws, seat] of this.seats) {
      send(ws, { t: "waiting", code, names, you: seat.index });
    }

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(
    ws: WebSocket,
    raw: string | ArrayBuffer,
  ): Promise<void> {
    if (typeof raw !== "string") return;
    const message = parseClientMessage(parseJson(raw));
    if (message === null) return;

    switch (message.t) {
      case "start":
        // Only the host (seat 0) can start the game
        const senderSeat = this.seats.get(ws);
        if (senderSeat?.index === 0) {
          this.startMatch();
        }
        break;
      case "move":
        this.relayToPeer(ws, {
          t: "peer-move",
          payload: message.payload,
          from: this.seats.get(ws)!.index,
        });
        break;
      case "rematch":
        if (this.seats.size >= 2) {
          this.broadcast({ t: "rematch-start", seed: randomSeed() });
        }
        break;
      case "leave":
        this.dropSeat(ws);
        ws.close(1000, "leave");
        break;
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    this.dropSeat(ws);
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    this.dropSeat(ws);
  }

  /** Second+ seat is in: same fresh seed to all, each told its own index. */
  private startMatch(): void {
    const seed = randomSeed();
    const names: string[] = new Array(this.seats.size).fill("");
    for (const seat of this.seats.values()) {
      names[seat.index] = seat.name;
    }
    for (const [ws, seat] of this.seats) {
      send(ws, { t: "start", seed, names, you: seat.index });
    }
  }

  private relayToPeer(from: WebSocket, message: ServerMessage): void {
    for (const ws of this.seats.keys()) {
      if (ws !== from) send(ws, message);
    }
  }

  private broadcast(message: ServerMessage): void {
    for (const ws of this.seats.keys()) {
      send(ws, message);
    }
  }

  private dropSeat(ws: WebSocket): void {
    if (!this.seats.delete(ws)) return; // an explicit leave already ran
    this.broadcast({ t: "peer-left" });
  }
}

// ── Worker-entry routing ──────────────────────────────────────────────────────

/** Routes a `/lobi/:code` WebSocket upgrade to that code's room instance. */
export async function handleLobbyUpgrade(
  request: Request,
  env: Env,
  code: string,
): Promise<Response> {
  const normalized = code.toUpperCase();
  if (!isValidLobbyCode(normalized)) {
    return new Response("Lobi bulunamadı", { status: 404 });
  }
  const stub = env.LOBBY_ROOM.get(env.LOBBY_ROOM.idFromName(normalized));
  return stub.fetch(request);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Accepts the pair just long enough to explain the rejection, then closes. */
function rejectSocket(
  client: WebSocket,
  server: WebSocket,
  reason: LobbyErrorReason,
): Response {
  server.accept();
  send(server, { t: "error", reason });
  server.close(1008, reason);
  return new Response(null, { status: 101, webSocket: client });
}

function send(ws: WebSocket, message: ServerMessage): void {
  try {
    ws.send(JSON.stringify(message));
  } catch {
    // Socket already closing — its close handler reaps the seat.
  }
}

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** Mirrored into the socket attachment so hibernation survives restarts. */
interface Seat {
  index: number; // 0 = host, 1–10 = joins
  name: string;
}
