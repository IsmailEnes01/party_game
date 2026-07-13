// Presentational Sayı Tahmin board: input + guess history for N players.
// Renders the narrowing range, guess history with feedback, and lets the
// current player submit a guess. All socket/lobby logic lives in the shell.

import type { BoardProps, PlayerIndex } from "@/entities/game";
import { cn } from "@/shared/lib/utils";
import {
  type NumbersMove,
  type NumbersState,
  numbersGame,
  TURNS_PER_PLAYER,
} from "../model/rules";

export function NumbersBoard({
  state,
  me,
  canMove,
  onMove,
}: BoardProps<NumbersState, NumbersMove>) {
  const gameStatus = numbersGame.status(state);
  const isGameOver = gameStatus.kind === "won";
  const winner = gameStatus.kind === "won" ? gameStatus.winner : -1;
  const isWinner = winner === me;

  // Calculate turns per player for display
  const turnsDisplay = state.turnsTaken.map((t, i) => ({
    player: i,
    turns: t,
    label: numbersGame.playerLabels[i] ?? `Oyuncu ${i + 1}`,
    isMe: i === me,
  }));

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {/* Range display */}
      <div className="w-full text-center text-sm text-muted-foreground">
        Aralık: <strong>{state.lowerBound}</strong> –{" "}
        <strong>{state.upperBound}</strong>
      </div>

      {/* Turn counter display */}
      <div className="w-full flex flex-wrap justify-center gap-1 text-xs text-muted-foreground">
        {turnsDisplay.map(({ player, turns, label, isMe }) => (
          <span
            key={player}
            className={cn(
              "px-2 py-1 rounded bg-muted",
              isMe && "bg-primary/10 font-medium",
            )}
          >
            {label}: {turns}/{TURNS_PER_PLAYER}
          </span>
        ))}
      </div>

      {/* Input row - disabled when game over or not your turn */}
      <div className="w-full flex gap-2">
        <input
          type="number"
          min={state.lowerBound}
          max={state.upperBound}
          placeholder={`${state.lowerBound}–${state.upperBound} arası tahmin`}
          disabled={!canMove || isGameOver}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = parseInt(e.currentTarget.value, 10);
              if (!Number.isNaN(value)) {
                onMove({ guess: value });
                e.currentTarget.value = "";
              }
            }
          }}
          className={cn(
            "flex-1 px-4 py-3 rounded-xl border bg-background text-center text-2xl font-mono",
            "enabled:hover:border-primary/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-primary",
          )}
          aria-label="Sayı tahmininizi girin"
        />
        <button
          type="button"
          disabled={!canMove || isGameOver}
          onClick={() => {
            const input = document.querySelector(
              "input[type=number]",
            ) as HTMLInputElement;
            if (input && !Number.isNaN(parseInt(input.value, 10))) {
              onMove({ guess: parseInt(input.value, 10) });
              input.value = "";
            }
          }}
          className={cn(
            "px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold",
            "enabled:hover:bg-primary/90 enabled:active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors",
          )}
        >
          {isGameOver ? "Oyun Bitti" : "Tahmin Et"}
        </button>
      </div>

      {/* Guess history */}
      <div className="w-full max-h-64 overflow-y-auto space-y-1">
        {state.guesses.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Henüz tahmin yok. İlk sen başla!
          </p>
        ) : (
          [...state.guesses]
            .reverse()
            .map((g, idx) => (
              <GuessRow
                key={idx}
                guess={g}
                me={me}
                playerLabel={
                  numbersGame.playerLabels[g.player] ?? `Oyuncu ${g.player + 1}`
                }
              />
            ))
        )}

        {isGameOver && (
          <div
            className={cn(
              "text-center py-3 rounded-xl font-semibold text-lg",
              isWinner
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
            )}
          >
            {isWinner ? (
              "🎉 Kazandın! Tebrikler!"
            ) : (
              <>
                Oyun bitti! Kazanan:{" "}
                {numbersGame.playerLabels[winner] ?? `Oyuncu ${winner + 1}`}
                {state.guesses.some((g) => g.result === "correct") && (
                  <span className="ml-2">(Doğru tahmin!)</span>
                )}
                {!state.guesses.some((g) => g.result === "correct") && (
                  <span className="ml-2">(En yakın tahmin kazandı)</span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Turn indicator / Game status */}
      <p className="text-xs text-muted-foreground text-center">
        {isGameOver ? (
          "Oyun bitti — Herkes 5 tur oynadı"
        ) : (
          <>
            Sıra:
            <span
              className={cn(
                "font-medium",
                me === state.currentPlayer ? "text-primary" : "",
              )}
            >
              {state.currentPlayer === me
                ? "(Sen)"
                : (numbersGame.playerLabels[state.currentPlayer] ??
                  `Oyuncu ${state.currentPlayer + 1}`)}
            </span>
            {state.turnsTaken[state.currentPlayer] >= TURNS_PER_PLAYER && (
              <span className="ml-2 text-amber-600">(Tur hakları bitti)</span>
            )}
          </>
        )}
      </p>
    </div>
  );
}

interface GuessRowProps {
  guess: NumbersState["guesses"][0];
  me: PlayerIndex;
  playerLabel: string;
}

function GuessRow({ guess, me, playerLabel }: GuessRowProps) {
  const isMe = guess.player === me;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        isMe && "bg-primary/10 ring-1 ring-primary/20",
        !isMe && "bg-muted/50",
      )}
    >
      <span className="font-mono text-xs text-muted-foreground w-10 text-right">
        {guess.value}
      </span>
      <span className="flex-1 text-left font-medium">
        {playerLabel}
        {isMe && " (Sen)"}
      </span>
      {guess.result === "correct" && (
        <span className="text-green-600 dark:text-green-400 font-bold">
          ✓ Doğru!
        </span>
      )}
      {guess.result === "higher" && (
        <span className="text-red-600 dark:text-red-400 font-mono">
          ⬆ Daha büyük
        </span>
      )}
      {guess.result === "lower" && (
        <span className="text-blue-600 dark:text-blue-400 font-mono">
          ⬇ Daha küçük
        </span>
      )}
    </div>
  );
}
