// Wire schema between the lobby client and the LobbyRoom Durable Object.
// Joining is implicit in the WebSocket URL (/lobi/:code?name=…&game=…), so no
// join message exists; these are the messages exchanged AFTER the connection.
// Parse-don't-cast: both sides run every inbound message through these
// parsers — ill-typed messages come back null (dropped, never thrown) and
// unknown extra fields are stripped so only the declared shape crosses over.

// ── Parsers ───────────────────────────────────────────────────────────────────

export function parseClientMessage(value: unknown): ClientMessage | null {
  if (!isRecord(value)) return null;
  switch (value.t) {
    case "move":
      return "payload" in value ? { t: "move", payload: value.payload } : null;
    case "start":
      return { t: "start" };
    case "rematch":
      return { t: "rematch" };
    case "leave":
      return { t: "leave" };
    default:
      return null;
  }
}

export function parseServerMessage(value: unknown): ServerMessage | null {
  if (!isRecord(value)) return null;
  switch (value.t) {
    case "waiting":
      return typeof value.code === "string" &&
        Array.isArray(value.names) &&
        typeof value.you === "number"
        ? { t: "waiting", code: value.code, names: value.names, you: value.you }
        : null;
    case "start": {
      const names = parseNames(value.names);
      const you = value.you;
      if (!isSeed(value.seed) || names === null) return null;
      if (typeof you !== "number" || you < 0 || you > 10) return null;
      return { t: "start", seed: value.seed, names, you };
    }
    case "peer-move":
      return "payload" in value && typeof value.from === "number"
        ? { t: "peer-move", payload: value.payload, from: value.from }
        : null;
    case "rematch-start":
      return isSeed(value.seed)
        ? { t: "rematch-start", seed: value.seed }
        : null;
    case "peer-left":
      return { t: "peer-left" };
    case "error":
      return isErrorReason(value.reason)
        ? { t: "error", reason: value.reason }
        : null;
    default:
      return null;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSeed(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseNames(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  // Allow 2–11 names (1 host + 1–10 joins)
  if (value.length < 2 || value.length > 11) return null;
  return value.every((v): v is string => typeof v === "string") ? value : null;
}

function isErrorReason(value: unknown): value is LobbyErrorReason {
  return value === "not-found" || value === "full" || value === "name-required";
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** Client → Durable Object (join happens via the URL, not a message). */
export type ClientMessage =
  | { t: "move"; payload: unknown }
  | { t: "start" }
  | { t: "rematch" }
  | { t: "leave" };

/** Durable Object → client. */
export type ServerMessage =
  | { t: "waiting"; code: string; names: string[]; you: number }
  | { t: "start"; seed: number; names: string[]; you: number }
  | { t: "peer-move"; payload: unknown; from: number }
  | { t: "rematch-start"; seed: number }
  | { t: "peer-left" }
  | { t: "error"; reason: LobbyErrorReason };

export type LobbyErrorReason = "not-found" | "full" | "name-required";
