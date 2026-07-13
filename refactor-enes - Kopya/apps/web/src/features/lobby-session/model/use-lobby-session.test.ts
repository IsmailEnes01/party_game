// Pure-reducer tests — no DOM, no socket. The session class's socket wiring
// is exercised end-to-end against the Durable Object; here we pin down every
// state transition, the Turkish error copy, and the capped-backoff walk.

import { describe, expect, it } from "vitest";
import type { ServerMessage } from "@/shared/lib/lobby-protocol";
import {
  INITIAL_SESSION_STATE,
  type LobbySessionState,
  reduceSession,
} from "./use-lobby-session";

const CODE = "AB2C";

const connecting: LobbySessionState = {
  phase: "connecting",
  code: CODE,
  attempt: 0,
};

const waiting: LobbySessionState = {
  phase: "waiting",
  code: CODE,
  names: ["Ayşe"],
  you: 0,
};

const playing: LobbySessionState = {
  phase: "playing",
  code: CODE,
  seed: 7,
  names: ["Ayşe", "Kaan"],
  you: 0,
};

const peerLeft: LobbySessionState = {
  phase: "peer-left",
  code: CODE,
  names: ["Ayşe", "Kaan"],
  you: 0,
};

function afterMessage(
  state: LobbySessionState,
  message: ServerMessage,
): LobbySessionState {
  return reduceSession(state, { kind: "message", message });
}

describe("reduceSession — happy path", () => {
  it("dials from idle into connecting at attempt 0", () => {
    expect(
      reduceSession(INITIAL_SESSION_STATE, { kind: "dial", code: CODE }),
    ).toEqual(connecting);
  });

  it("moves the host from connecting to waiting with the shareable code", () => {
    expect(
      afterMessage(connecting, {
        t: "waiting",
        code: CODE,
        names: ["Ayşe"],
        you: 0,
      }),
    ).toEqual(waiting);
  });

  it("starts playing from waiting when the guest arrives", () => {
    const message: ServerMessage = {
      t: "start",
      seed: 7,
      names: ["Ayşe", "Kaan"],
      you: 0,
    };
    expect(afterMessage(waiting, message)).toEqual(playing);
  });

  it("starts playing straight from connecting (the guest never waits)", () => {
    const message: ServerMessage = {
      t: "start",
      seed: 7,
      names: ["Ayşe", "Kaan"],
      you: 0,
    };
    expect(afterMessage(connecting, message)).toEqual(playing);
  });

  it("resets to playing with the new seed on rematch-start", () => {
    expect(afterMessage(playing, { t: "rematch-start", seed: 99 })).toEqual({
      ...playing,
      seed: 99,
    });
  });

  it("keeps names and seat through peer-left, then restarts on rejoin", () => {
    expect(afterMessage(playing, { t: "peer-left" })).toEqual(peerLeft);
    const rejoin: ServerMessage = {
      t: "start",
      seed: 12,
      names: ["Ayşe", "Derya"],
      you: 0,
    };
    expect(afterMessage(peerLeft, rejoin)).toEqual({
      phase: "playing",
      code: CODE,
      seed: 12,
      names: ["Ayşe", "Derya"],
      you: 0,
    });
  });

  it("treats peer-move as a side channel — state is untouched", () => {
    expect(
      afterMessage(playing, { t: "peer-move", payload: { cell: 4 }, from: 1 }),
    ).toBe(playing);
  });
});

describe("reduceSession — errors (stable Turkish copy)", () => {
  it("maps every protocol rejection to its message", () => {
    expect(
      afterMessage(connecting, { t: "error", reason: "not-found" }),
    ).toEqual({
      phase: "error",
      reason: "not-found",
      message: "Lobi bulunamadı",
    });
    expect(afterMessage(connecting, { t: "error", reason: "full" })).toEqual({
      phase: "error",
      reason: "full",
      message: "Lobi dolu",
    });
    expect(
      afterMessage(connecting, { t: "error", reason: "name-required" }),
    ).toEqual({
      phase: "error",
      reason: "name-required",
      message: "Takma ad gerekli",
    });
  });

  it("reports the generic message once redials are exhausted", () => {
    const exhausted = reduceSession(
      { phase: "connecting", code: CODE, attempt: 3 },
      { kind: "socket-closed" },
    );
    expect(exhausted).toEqual({
      phase: "error",
      reason: "connection",
      message: "Bağlantı koptu",
    });
  });
});

describe("reduceSession — reconnect backoff", () => {
  it("schedules redials 1..3 and only then gives up", () => {
    let state = reduceSession(playing, { kind: "socket-closed" });
    expect(state).toEqual({ phase: "connecting", code: CODE, attempt: 1 });
    state = reduceSession(state, { kind: "socket-closed" });
    expect(state).toEqual({ phase: "connecting", code: CODE, attempt: 2 });
    state = reduceSession(state, { kind: "socket-closed" });
    expect(state).toEqual({ phase: "connecting", code: CODE, attempt: 3 });
    state = reduceSession(state, { kind: "socket-closed" });
    expect(state.phase).toBe("error");
  });

  it("redials from waiting and peer-left as well", () => {
    expect(reduceSession(waiting, { kind: "socket-closed" })).toEqual({
      phase: "connecting",
      code: CODE,
      attempt: 1,
    });
    expect(reduceSession(peerLeft, { kind: "socket-closed" })).toEqual({
      phase: "connecting",
      code: CODE,
      attempt: 1,
    });
  });

  it("a successful reconnect resets the budget (waiting clears attempt)", () => {
    const redialing: LobbySessionState = {
      phase: "connecting",
      code: CODE,
      attempt: 2,
    };
    const recovered = afterMessage(redialing, {
      t: "waiting",
      code: CODE,
      names: ["Ayşe"],
      you: 0,
    });
    expect(recovered).toEqual(waiting);
    expect(reduceSession(recovered, { kind: "socket-closed" })).toEqual({
      phase: "connecting",
      code: CODE,
      attempt: 1,
    });
  });

  it("ignores closes after the session settled", () => {
    const closed: LobbySessionState = { phase: "closed" };
    const failed: LobbySessionState = {
      phase: "error",
      reason: "full",
      message: "Lobi dolu",
    };
    expect(
      reduceSession(INITIAL_SESSION_STATE, { kind: "socket-closed" }),
    ).toBe(INITIAL_SESSION_STATE);
    expect(reduceSession(closed, { kind: "socket-closed" })).toBe(closed);
    expect(reduceSession(failed, { kind: "socket-closed" })).toBe(failed);
  });
});

describe("reduceSession — leaving and retrying", () => {
  it("leave settles every live phase to closed (idle stays idle)", () => {
    expect(reduceSession(INITIAL_SESSION_STATE, { kind: "leave" })).toBe(
      INITIAL_SESSION_STATE,
    );
    for (const state of [connecting, waiting, playing, peerLeft]) {
      expect(reduceSession(state, { kind: "leave" })).toEqual({
        phase: "closed",
      });
    }
  });

  it("a fresh dial restarts from error or closed", () => {
    const failed: LobbySessionState = {
      phase: "error",
      reason: "connection",
      message: "Bağlantı koptu",
    };
    expect(reduceSession(failed, { kind: "dial", code: "XY34" })).toEqual({
      phase: "connecting",
      code: "XY34",
      attempt: 0,
    });
    expect(
      reduceSession({ phase: "closed" }, { kind: "dial", code: "XY34" }),
    ).toEqual({ phase: "connecting", code: "XY34", attempt: 0 });
  });

  it("ignores out-of-phase messages without inventing states", () => {
    expect(
      afterMessage(playing, {
        t: "waiting",
        code: CODE,
        names: ["Ayşe"],
        you: 0,
      }),
    ).toBe(playing);
    expect(afterMessage(waiting, { t: "rematch-start", seed: 5 })).toBe(
      waiting,
    );
    expect(afterMessage(waiting, { t: "peer-left" })).toBe(waiting);
    expect(
      afterMessage(INITIAL_SESSION_STATE, {
        t: "start",
        seed: 1,
        names: ["a", "b"],
        you: 1,
      }),
    ).toBe(INITIAL_SESSION_STATE);
  });
});
