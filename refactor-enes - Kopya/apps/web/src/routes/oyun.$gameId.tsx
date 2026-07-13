// The one dynamic game page: resolves the GameDef + board pair from the
// catalog, validates the ?lobi=CODE invite search param, and hands the whole
// play experience to the game-shell widget. The shell renders ClientOnly —
// it reads localStorage and dials WebSockets, neither of which SSRs.

import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/shared/config";
import { isValidLobbyCode } from "@/shared/lib/lobby-code";
import { buttonVariants } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { GameShell } from "@/widgets/game-shell";
import { gamesById } from "./-catalog";

export const Route = createFileRoute("/oyun/$gameId")({
  validateSearch: validateGameSearch,
  component: GamePage,
});

function GamePage() {
  const { gameId } = Route.useParams();
  const { lobi } = Route.useSearch();
  const game = gamesById.get(gameId);

  if (game === undefined) return <GameNotFound />;

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {BRAND}
        </Link>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <span aria-hidden="true">{game.def.meta.icon}</span>
          {game.def.meta.name}
        </h1>
      </header>

      <ClientOnly fallback={<ShellFallback />}>
        <GameShell game={game} lobbyCode={lobi} />
      </ClientOnly>
    </main>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

function GameNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <span aria-hidden="true" className="text-5xl">
        🧭
      </span>
      <h1 className="text-2xl font-bold">Oyun bulunamadı</h1>
      <p className="text-muted-foreground">Aradığın oyun bu lobide yok.</p>
      <Link to="/" className={buttonVariants({ size: "lg" })}>
        Ana sayfaya dön
      </Link>
    </main>
  );
}

function ShellFallback() {
  return (
    <div className="flex justify-center py-24">
      <Spinner className="size-6" />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Keep only a well-formed ?lobi=CODE (normalized to uppercase); junk drops. */
function validateGameSearch(search: Record<string, unknown>): GameSearch {
  const raw = search.lobi;
  const code = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  return isValidLobbyCode(code) ? { lobi: code } : {};
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface GameSearch {
  lobi?: string;
}
