// The contract every Lobi game implements. Games are pure and deterministic:
// `init` derives all randomness from the room seed (via the seeded RNG in
// @/shared/lib/seeded-rng), `applyMove` returns the next state or `null` to
// reject, and the lobby relays moves without ever interpreting them — both
// clients replay the same move stream in lockstep.

export type PlayerIndex = number; // 0 = host, 1–10 = joins

export type GameStatus =
  | { kind: "ongoing" }
  | { kind: "won"; winner: PlayerIndex }
  | { kind: "draw" };

/** Catalog card data. `name` and `tagline` are Turkish UI copy; `icon` is a
 * lucide-react icon name or an emoji — games use emoji for zero coupling. */
export interface GameMeta {
  id: string;
  name: string;
  icon: string;
  tagline: string;
}

export interface GameDef<S, M> {
  meta: GameMeta;
  /** Turkish seat labels indexed by PlayerIndex (e.g. ["X", "O"] for 2 players). */
  playerLabels: string[];
  /** Minimum players required to start the game. Default: 2. */
  minPlayers?: number;
  /** `names` is the list of player names from the lobby (length = player count). */
  init(seed: number, names: string[]): S;
  /** Next state, or null when the move is invalid (ignored, never thrown). */
  applyMove(state: S, move: M, player: PlayerIndex): S | null;
  status(state: S): GameStatus;
  /** Whose turn; null when the game is over or moves are simultaneous. */
  turn(state: S): PlayerIndex | null;
}

/** Every board is presentational: render `state`, call `onMove`, honor
 * `canMove` — no sockets, no lobby imports. */
export interface BoardProps<S, M> {
  state: S;
  me: PlayerIndex;
  canMove: boolean;
  onMove(move: M): void;
}
