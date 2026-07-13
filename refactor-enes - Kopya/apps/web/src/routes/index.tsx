// Home: the Lobi hero and the six-game catalog grid. Every card deep-links
// to /oyun/$gameId; the games come from the -catalog.ts registry, nowhere
// else.

import { createFileRoute, Link } from "@tanstack/react-router";
import type { GameMeta } from "@/entities/game";
import { BRAND } from "@/shared/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { gamesList } from "./-catalog";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center gap-12 px-4 py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
          {BRAND}
          <span className="text-primary">.</span>
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          İki kişilik oyunlar: lobi kur, kodu arkadaşına gönder, hemen oyna.
          Kayıt yok, kurulum yok.
        </p>
        <HowItWorks />
      </header>

      <section
        aria-label="Oyunlar"
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {gamesList.map(({ def }) => (
          <GameCard key={def.meta.id} meta={def.meta} />
        ))}
      </section>
    </main>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

function GameCard({ meta }: GameCardProps) {
  return (
    <Link
      to="/oyun/$gameId"
      params={{ gameId: meta.id }}
      className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-3 transition-all group-hover:-translate-y-1 group-hover:shadow-md">
        <CardHeader className="gap-2">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-accent text-3xl transition-transform group-hover:scale-110"
          >
            {meta.icon}
          </span>
          <CardTitle className="text-lg">{meta.name}</CardTitle>
          <CardDescription>{meta.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Oyna →
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function HowItWorks() {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
      <Step number={1} label="Lobi kur" />
      <span aria-hidden="true">→</span>
      <Step number={2} label="Kodu paylaş" />
      <span aria-hidden="true">→</span>
      <Step number={3} label="Oyna" />
    </ol>
  );
}

function Step({ number, label }: StepProps) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
        {number}
      </span>
      {label}
    </li>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface GameCardProps {
  meta: GameMeta;
}

interface StepProps {
  number: number;
  label: string;
}
