import { describe, expect, it } from "vitest";
import { type NumbersState, numbersGame } from "./rules";

const NAMES = ["Player 1", "Player 2", "Player 3"];

// Helper to create a controlled state for testing
function createTestState(overrides: Partial<NumbersState> = {}): NumbersState {
  return {
    target: 50,
    guesses: [],
    lowerBound: 0,
    upperBound: 100,
    currentPlayer: 0,
    playerCount: 3,
    turnsTaken: [0, 0, 0],
    ...overrides,
  };
}

describe("numbersGame", () => {
  describe("init", () => {
    it("is identical for the same seed", () => {
      expect(numbersGame.init(42, NAMES)).toEqual(numbersGame.init(42, NAMES));
    });

    it("uses seed to determine target", () => {
      const state1 = numbersGame.init(1, NAMES);
      expect(state1.target).toBeGreaterThanOrEqual(0);
      expect(state1.target).toBeLessThanOrEqual(100);
      expect(state1.playerCount).toBe(3);
      expect(state1.turnsTaken).toEqual([0, 0, 0]);
    });

    it("starts with correct initial state", () => {
      const state = numbersGame.init(0, NAMES);
      expect(state.guesses).toEqual([]);
      expect(state.lowerBound).toBe(0);
      expect(state.upperBound).toBe(100);
      expect(state.currentPlayer).toBe(0);
      expect(state.playerCount).toBe(3);
      expect(state.turnsTaken).toEqual([0, 0, 0]);
    });
  });

  describe("turn order and 5-turn limit", () => {
    it("cycles through players in order", () => {
      let state = createTestState();

      // Player 0 guesses
      state = numbersGame.applyMove(state, { guess: 25 }, 0)!;
      expect(state.currentPlayer).toBe(1);
      expect(state.turnsTaken).toEqual([1, 0, 0]);

      // Player 1 guesses
      state = numbersGame.applyMove(state, { guess: 75 }, 1)!;
      expect(state.currentPlayer).toBe(2);
      expect(state.turnsTaken).toEqual([1, 1, 0]);

      // Player 2 guesses
      state = numbersGame.applyMove(state, { guess: 50 }, 2)!;
      expect(state.currentPlayer).toBe(0);
      expect(state.turnsTaken).toEqual([1, 1, 1]);
    });

    it("skips players who have used all 5 turns", () => {
      let state = createTestState({
        turnsTaken: [5, 0, 0],
        currentPlayer: 1, // It's player 1's turn
      });
      // Next turn should be player 1, then skip to player 2
      state = numbersGame.applyMove(state, { guess: 50 }, 1)!;
      expect(state.currentPlayer).toBe(2);
      expect(state.turnsTaken).toEqual([5, 1, 0]);
    });

    it("rejects move from player who has used all 5 turns", () => {
      const state = createTestState({ turnsTaken: [5, 0, 0] });
      const result = numbersGame.applyMove(state, { guess: 50 }, 0);
      expect(result).toBeNull();
    });

    it("ends game when all players have 5 turns", () => {
      // Build state with all players having 5 turns manually (and some guesses)
      const state = createTestState({
        target: 50,
        guesses: [
          { player: 0, value: 40, result: "higher" as const },
          { player: 1, value: 60, result: "lower" as const },
          { player: 2, value: 30, result: "higher" as const },
        ],
        turnsTaken: [5, 5, 5],
      });
      // Game should be over
      const gameStatus = numbersGame.status(state);
      expect(gameStatus.kind).toBe("won");
      if (gameStatus.kind === "won") {
        expect(gameStatus.winner).toBeDefined();
      }
    });
  });

  describe("guess feedback", () => {
    it("returns 'correct' for exact guess", () => {
      const state = createTestState({ target: 50 });
      const nextState = numbersGame.applyMove(state, { guess: 50 }, 0)!;
      const lastGuess = nextState.guesses[nextState.guesses.length - 1];
      expect(lastGuess.result).toBe("correct");
    });

    it("returns 'higher' when guess is too low", () => {
      let state = createTestState({ target: 50 });
      state = numbersGame.applyMove(state, { guess: 40 }, 0)!;
      const lastGuess = state.guesses[state.guesses.length - 1];
      expect(lastGuess.result).toBe("higher");
      expect(state.lowerBound).toBe(41);
    });

    it("returns 'lower' when guess is too high", () => {
      let state = createTestState({ target: 50 });
      state = numbersGame.applyMove(state, { guess: 60 }, 0)!;
      const lastGuess = state.guesses[state.guesses.length - 1];
      expect(lastGuess.result).toBe("lower");
      expect(state.upperBound).toBe(59);
    });

    it("narrows bounds correctly over multiple guesses", () => {
      let state = createTestState({ target: 50 });

      // Guess too low
      state = numbersGame.applyMove(state, { guess: 30 }, 0)!;
      expect(state.lowerBound).toBe(31);

      // Next player guesses too high
      state = numbersGame.applyMove(state, { guess: 70 }, 1)!;
      expect(state.upperBound).toBe(69);

      // Next player guesses in narrowed range
      state = numbersGame.applyMove(state, { guess: 45 }, 2)!;
      expect(state.lowerBound).toBe(46);
    });
  });

  describe("winner determination", () => {
    it("first correct guess wins immediately", () => {
      let state = createTestState({ target: 50 });

      // Player 0 guesses wrong
      state = numbersGame.applyMove(state, { guess: 40 }, 0)!;
      // Player 1 guesses correct
      state = numbersGame.applyMove(state, { guess: 50 }, 1)!;

      const gameStatus = numbersGame.status(state);
      expect(gameStatus.kind).toBe("won");
      if (gameStatus.kind === "won") {
        expect(gameStatus.winner).toBe(1);
      }
    });

    it("closest guess wins when no correct guess after all turns", () => {
      // Create state with all 5 turns played, no correct guess
      const state = createTestState({
        target: 50,
        guesses: [
          { player: 0, value: 40, result: "higher" as const }, // dist 10
          { player: 1, value: 70, result: "lower" as const }, // dist 20
          { player: 2, value: 30, result: "higher" as const }, // dist 20
          // Round 2
          { player: 0, value: 45, result: "higher" as const }, // dist 5 (best)
          { player: 1, value: 65, result: "lower" as const }, // dist 15
          { player: 2, value: 35, result: "higher" as const }, // dist 15
          // Round 3
          { player: 0, value: 48, result: "higher" as const }, // dist 2 (best)
          { player: 1, value: 60, result: "lower" as const }, // dist 10
          { player: 2, value: 40, result: "higher" as const }, // dist 10
          // Round 4
          { player: 0, value: 49, result: "higher" as const }, // dist 1 (best)
          { player: 1, value: 55, result: "lower" as const }, // dist 5
          { player: 2, value: 45, result: "higher" as const }, // dist 5
          // Round 5
          { player: 0, value: 47, result: "higher" as const }, // dist 3
          { player: 1, value: 52, result: "lower" as const }, // dist 2
          { player: 2, value: 48, result: "higher" as const }, // dist 2
        ],
        lowerBound: 49,
        upperBound: 51,
        currentPlayer: 0,
        playerCount: 3,
        turnsTaken: [5, 5, 5],
      });

      const gameStatus = numbersGame.status(state);
      expect(gameStatus.kind).toBe("won");
      if (gameStatus.kind === "won") {
        // Player 0 has closest guess (49, dist 1)
        expect(gameStatus.winner).toBe(0);
      }
    });

    it("earlier guess wins tie on distance", () => {
      const state = createTestState({
        target: 50,
        guesses: [
          { player: 0, value: 40, result: "higher" as const },
          { player: 1, value: 60, result: "lower" as const },
          { player: 2, value: 30, result: "higher" as const },
        ],
        lowerBound: 41,
        upperBound: 59,
        currentPlayer: 0,
        playerCount: 3,
        turnsTaken: [5, 5, 5],
      });

      const gameStatus = numbersGame.status(state);
      expect(gameStatus.kind).toBe("won");
      if (gameStatus.kind === "won") {
        // Player 0 and 1 both have distance 10, player 0 guessed first
        expect(gameStatus.winner).toBe(0);
      }
    });
  });

  describe("invalid moves", () => {
    it("rejects out-of-bounds guesses", () => {
      let state = createTestState();
      state = numbersGame.applyMove(state, { guess: 50 }, 0)!;
      const lowerBound = state.lowerBound;
      const upperBound = state.upperBound;

      // Try to guess outside bounds
      const result1 = numbersGame.applyMove(
        state,
        { guess: upperBound + 1 },
        1,
      );
      expect(result1).toBeNull();

      const result2 = numbersGame.applyMove(
        state,
        { guess: lowerBound - 1 },
        1,
      );
      expect(result2).toBeNull();
    });

    it("rejects non-integer guesses", () => {
      const state = createTestState();
      expect(numbersGame.applyMove(state, { guess: 3.14 }, 0)).toBeNull();
      // @ts-expect-error testing invalid input
      expect(numbersGame.applyMove(state, { guess: "50" }, 0)).toBeNull();
    });

    it("rejects moves when game is over", () => {
      const state = createTestState({ turnsTaken: [5, 5, 5] });
      expect(numbersGame.applyMove(state, { guess: 50 }, 0)).toBeNull();
    });

    it("rejects out-of-turn moves", () => {
      const state = createTestState();
      expect(numbersGame.applyMove(state, { guess: 50 }, 1)).toBeNull(); // not player 0's turn
    });
  });

  describe("turn function", () => {
    it("returns current player when game ongoing", () => {
      const state = createTestState();
      expect(numbersGame.turn(state)).toBe(0);
    });

    it("returns next available player when current has used all turns", () => {
      const state = createTestState({
        turnsTaken: [5, 0, 0],
        currentPlayer: 0,
      });
      expect(numbersGame.turn(state)).toBe(1);
    });

    it("returns null when all players have used all turns", () => {
      const state = createTestState({ turnsTaken: [5, 5, 5] });
      expect(numbersGame.turn(state)).toBeNull();
    });

    it("returns null when game is won by correct guess", () => {
      let state = createTestState({ target: 50 });
      state = numbersGame.applyMove(state, { guess: 50 }, 0)!;
      expect(numbersGame.turn(state)).toBeNull();
    });
  });
});
