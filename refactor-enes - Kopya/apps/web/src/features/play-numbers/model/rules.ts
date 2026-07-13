// Sayı Tahmin (Numbers) — N-player turn-based guessing game.
// A random target (0–100) is derived from the room seed. Players take turns
// guessing; each guess gets "higher/lower" feedback. After EVERY player has
// taken exactly 5 turns, the game ends. Winner = closest guess (or first
// correct guess if any). Pure, deterministic, no framework coupling.

import type { GameDef, GameStatus, PlayerIndex } from "@/entities/game";
import { mulberry32 } from "@/shared/lib/seeded-rng";

export const TURNS_PER_PLAYER = 5;

// ── Game definition ────────────────────────────────────────────────────────────

export const numbersGame: GameDef<NumbersState, NumbersMove> = {
  meta: {
    id: "sayi-tahmin",
    name: "Sayı Tahmin",
    icon: "🔢",
    tagline: "0–100 arası sayıyı bul — herkes 5 tur",
  },
  playerLabels: [
    "Oyuncu 1",
    "Oyuncu 2",
    "Oyuncu 3",
    "Oyuncu 4",
    "Oyuncu 5",
    "Oyuncu 6",
    "Oyuncu 7",
    "Oyuncu 8",
    "Oyuncu 9",
    "Oyuncu 10",
    "Oyuncu 11",
  ],
  minPlayers: 2,
  init,
  applyMove,
  status,
  turn,
};

// ── Constants ────────────────────────────────────────────────────────────────

const MIN_VALUE = 0;
const MAX_VALUE = 100;

/** Target number is derived from seed for deterministic lockstep. */
function init(seed: number, names: string[]): NumbersState {
  const rng = mulberry32(seed);
  const target = Math.floor(rng() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
  const playerCount = names.length;
  return {
    target,
    guesses: [],
    lowerBound: MIN_VALUE,
    upperBound: MAX_VALUE,
    currentPlayer: 0,
    playerCount,
    turnsTaken: new Array(playerCount).fill(0),
  };
}

function applyMove(
  state: NumbersState,
  move: NumbersMove,
  player: PlayerIndex,
): NumbersState | null {
  if (status(state).kind !== "ongoing") return null;
  if (player !== state.currentPlayer) return null; // not your turn
  if (typeof move.guess !== "number") return null;
  if (!Number.isInteger(move.guess)) return null;
  if (move.guess < state.lowerBound || move.guess > state.upperBound)
    return null;

  // Check if current player has already taken 5 turns
  if (state.turnsTaken[player] >= TURNS_PER_PLAYER) return null;

  const guessEntry: GuessEntry = {
    player,
    value: move.guess,
    result:
      move.guess === state.target
        ? "correct"
        : move.guess < state.target
          ? "higher"
          : "lower",
  };

  let lowerBound = state.lowerBound;
  let upperBound = state.upperBound;
  if (guessEntry.result === "higher") lowerBound = move.guess + 1;
  else if (guessEntry.result === "lower") upperBound = move.guess - 1;

  // Update turns taken for this player
  const newTurnsTaken = [...state.turnsTaken];
  newTurnsTaken[player] += 1;

  // Find next player who hasn't used all 5 turns
  let nextPlayer = (state.currentPlayer + 1) % state.playerCount;
  let checked = 0;
  while (
    newTurnsTaken[nextPlayer] >= TURNS_PER_PLAYER &&
    checked < state.playerCount
  ) {
    nextPlayer = (nextPlayer + 1) % state.playerCount;
    checked++;
  }

  // If all players have taken 5 turns, game ends (status will handle it)
  // currentPlayer will point to someone with <5 turns, or if all have 5, status becomes "won"

  return {
    target: state.target,
    guesses: [...state.guesses, guessEntry],
    lowerBound,
    upperBound,
    currentPlayer: nextPlayer,
    playerCount: state.playerCount,
    turnsTaken: newTurnsTaken,
  };
}

function status(state: NumbersState): GameStatus {
  // Check if all players have taken 5 turns
  const allTurnsDone = state.turnsTaken.every((t) => t >= TURNS_PER_PLAYER);

  if (allTurnsDone || state.guesses.length === 0) {
    // Game ended (or hasn't started) - determine winner
    if (state.guesses.length === 0) {
      return { kind: "ongoing" }; // hasn't started yet
    }
    return { kind: "won", winner: determineWinner(state) };
  }

  // Check for early correct guess (instant win)
  const lastGuess = state.guesses[state.guesses.length - 1];
  if (lastGuess?.result === "correct") {
    return { kind: "won", winner: lastGuess.player };
  }

  return { kind: "ongoing" };
}

/** Determine winner: first correct guess wins, otherwise closest guess. */
function determineWinner(state: NumbersState): PlayerIndex {
  // First, check if anyone guessed correctly
  const correctGuess = state.guesses.find((g) => g.result === "correct");
  if (correctGuess) return correctGuess.player;

  // Otherwise, closest guess wins (tie goes to earlier guess)
  let bestPlayer = state.guesses[0].player;
  let bestDiff = Math.abs(state.guesses[0].value - state.target);

  for (let i = 1; i < state.guesses.length; i++) {
    const diff = Math.abs(state.guesses[i].value - state.target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestPlayer = state.guesses[i].player;
    }
  }
  return bestPlayer;
}

function turn(state: NumbersState): PlayerIndex | null {
  if (status(state).kind !== "ongoing") return null;
  // If current player has used all 5 turns, turn() should return null
  // (game logic will advance to next available player in applyMove)
  if (state.turnsTaken[state.currentPlayer] >= TURNS_PER_PLAYER) {
    // Find next player with turns remaining
    let next = (state.currentPlayer + 1) % state.playerCount;
    let checked = 0;
    while (
      state.turnsTaken[next] >= TURNS_PER_PLAYER &&
      checked < state.playerCount
    ) {
      next = (next + 1) % state.playerCount;
      checked++;
    }
    if (checked >= state.playerCount) return null; // all done
    return next;
  }
  return state.currentPlayer;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type NumbersMove = { guess: number };

export interface GuessEntry {
  player: PlayerIndex;
  value: number;
  result: "correct" | "higher" | "lower";
}

export interface NumbersState {
  target: number;
  guesses: GuessEntry[];
  lowerBound: number;
  upperBound: number;
  currentPlayer: PlayerIndex;
  playerCount: number;
  turnsTaken: number[]; // per-player turn count
}
