// The whole play experience for one game: nickname gate, create/join lobby
// panel, the live board wired to the lockstep relay, turn/status bar, and the
// rematch / peer-left / connection flows. Game-agnostic — receives a
// { def, Board } pair, treats every move as `unknown`, and validates by
// attempting applyMove (null → ignore). Boards stay presentational; the
// lobby-session feature owns the socket.

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type {
  BoardProps,
  GameDef,
  GameStatus,
  PlayerIndex,
} from "@/entities/game";
import { getNickname, setNickname } from "@/entities/player";
import { useLobbySession } from "@/features/lobby-session";
import type { LobbySessionState } from "@/features/lobby-session";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";
import type { MatchState } from "../model/use-match";
import { useMatch } from "../model/use-match";
import { LobbyPanel, NicknameGate, WaitingPanel } from "./lobby-panel";

// ── Component ─────────────────────────────────────────────────────────────────

export function GameShell({ game, lobbyCode }: GameShellProps) {
  const [nickname, setNicknameState] = useState<string | null>(getNickname);
  const [editingName, setEditingName] = useState(false);
  const [rematchKey, setRematchKey] = useState<object | null>(null);

  // applyPeerMove is re-derived every render; the ref keeps the socket's
  // side channel pointed at the newest one (its captures are all stable).
  const applyPeerMoveRef = useRef<(payload: unknown, player: number) => void>(
    () => undefined,
  );
  const lobby = useLobbySession({
    onPeerMove: (payload, player) => applyPeerMoveRef.current(payload, player),
  });
  const match = useMatch(game.def, lobby.state);
  useEffect(() => {
    applyPeerMoveRef.current = match.applyPeerMove;
  });

  // Invite links auto-join exactly once, as soon as a nickname exists and
  // the session is still idle; a later leave() must not re-trigger it.
  const autoJoinedRef = useRef(false);
  useEffect(() => {
    if (lobbyCode === undefined || autoJoinedRef.current) return;
    if (nickname === null || lobby.state.phase !== "idle") return;
    autoJoinedRef.current = true;
    lobby.join({ code: lobbyCode, name: nickname, game: game.def.meta.id });
  }, [lobbyCode, nickname, lobby, game.def.meta.id]);

  function handleMove(move: unknown): void {
    if (match.playMove(move)) lobby.sendMove(move);
  }

  function requestRematch(): void {
    if (match.match === null) return;
    setRematchKey(match.match.key);
    lobby.sendRematch();
  }

  function saveNickname(name: string): void {
    setNickname(name);
    setNicknameState(name);
    setEditingName(false);
  }

  if (nickname === null || editingName) {
    return (
      <NicknameGate
        initialName={nickname ?? ""}
        onSave={saveNickname}
        onCancel={nickname !== null ? () => setEditingName(false) : undefined}
      />
    );
  }

  const session = lobby.state;
  const rematchRequested =
    match.match !== null && rematchKey === match.match.key;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {(session.phase === "idle" || session.phase === "closed") && (
        <LobbyPanel
          nickname={nickname}
          initialCode={lobbyCode}
          onEditNickname={() => setEditingName(true)}
          onCreate={() =>
            lobby.create({ name: nickname, game: game.def.meta.id })
          }
          onJoin={(code) =>
            lobby.join({ code, name: nickname, game: game.def.meta.id })
          }
        />
      )}

      {session.phase === "connecting" && (
        <ConnectingCard attempt={session.attempt} />
      )}

      {session.phase === "waiting" && (
        <WaitingPanel
          code={session.code}
          gameId={game.def.meta.id}
          onCancel={lobby.leave}
          minPlayers={game.def.minPlayers ?? 2}
          playerCount={session.names.length}
          isHost={session.you === 0}
          onStart={lobby.sendStart}
        />
      )}

      {(session.phase === "playing" || session.phase === "peer-left") &&
        match.match !== null && (
          <MatchView
            game={game}
            session={session}
            match={match.match}
            canMove={match.canMove}
            onMove={handleMove}
            rematchRequested={rematchRequested}
            onRematch={requestRematch}
            onLeave={lobby.leave}
          />
        )}

      {session.phase === "error" && (
        <ErrorCard message={session.message} onBack={lobby.leave} />
      )}
    </div>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

/** Status bar + the game's board + the rematch / peer-left tail. */
function MatchView({
  game,
  session,
  match,
  canMove,
  onMove,
  rematchRequested,
  onRematch,
  onLeave,
}: MatchViewProps) {
  const status = game.def.status(match.state);
  const turn = game.def.turn(match.state);
  const peerLeft = session.phase === "peer-left";
  const finished = status.kind !== "ongoing";

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <StatusBar
        game={game.def}
        names={session.names}
        you={match.you}
        code={session.code}
        status={status}
        turn={turn}
        peerLeft={peerLeft}
        onLeave={onLeave}
      />

      <game.Board
        state={match.state}
        me={match.you}
        canMove={canMove}
        onMove={onMove}
      />

      {peerLeft ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Rakip aynı kodla geri dönerse oyun baştan başlar.
          </p>
          <Button variant="outline" onClick={onLeave}>
            Lobiye dön
          </Button>
        </div>
      ) : (
        finished && (
          <Button size="lg" onClick={onRematch} disabled={rematchRequested}>
            {rematchRequested && <Spinner />}
            {rematchRequested ? "Başlatılıyor…" : "Tekrar oyna"}
          </Button>
        )
      )}
    </div>
  );
}

/** Lobby code, all player chips (turn highlighted), one status line. */
function StatusBar({
  game,
  names,
  you,
  code,
  status,
  turn,
  peerLeft,
  onLeave,
}: StatusBarProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="font-mono tracking-widest">
          {code}
        </Badge>
        <Button variant="ghost" size="xs" onClick={onLeave}>
          Ayrıl
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {names.map((name, index) => (
          <PlayerChip
            key={index}
            name={name}
            label={game.playerLabels[index] ?? String(index)}
            index={index}
            isMe={you === index}
            isTurn={!peerLeft && turn === index}
          />
        ))}
      </div>

      <p
        aria-live="polite"
        className={cn(
          "text-center text-sm font-medium",
          peerLeft && "text-destructive",
        )}
      >
        {peerLeft ? "Oyuncu ayrıldı" : statusText(status, turn, names, you)}
      </p>
    </div>
  );
}

function PlayerChip({ name, label, index, isMe, isTurn }: PlayerChipProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm shadow-sm transition-shadow",
        isTurn && "border-primary ring-2 ring-primary/30",
      )}
    >
      <span
        className={cn(
          "font-mono text-xs font-bold",
          index === 0 ? "text-player-one" : "text-player-two",
        )}
      >
        {label}
      </span>
      <span className="font-medium">{name}</span>
      {isMe && <span className="text-xs text-muted-foreground">(sen)</span>}
    </span>
  );
}

function ConnectingCard({ attempt }: ConnectingCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex items-center justify-center gap-3 py-6">
        <Spinner />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {attempt === 0
            ? "Bağlanıyor…"
            : `Bağlantı koptu — yeniden deneniyor (${attempt}. deneme)…`}
        </p>
      </CardContent>
    </Card>
  );
}

function ErrorCard({ message, onBack }: ErrorCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md border-destructive/40">
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
        <p className="text-lg font-semibold text-destructive">{message}</p>
        <Button variant="outline" onClick={onBack}>
          Lobiye dön
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** One Turkish line: whose turn, or the result. */
function statusText(
  status: GameStatus,
  turn: PlayerIndex | null,
  names: string[],
  you: PlayerIndex,
): string {
  if (status.kind === "won") {
    return status.winner === you
      ? "Kazandın! 🎉"
      : `${names[status.winner] ?? "Oyuncu"} kazandı`;
  }
  if (status.kind === "draw") return "Berabere!";
  if (turn === null) return "Seçimler aynı anda yapılır";
  return turn === you ? "Sıra sende" : `Sıra: ${names[turn] ?? "Oyuncu"}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** A catalog entry the shell can drive. `Board` is method-typed so concrete
 * `GameDef`/board pairs assign without casts (method parameters compare
 * bivariantly) — the shell only ever feeds it what `applyMove` accepted. */
export interface ShellGame {
  def: GameDef<unknown, unknown>;
  Board(props: BoardProps<unknown, unknown>): ReactNode;
}

export interface GameShellProps {
  game: ShellGame;
  /** Invite-link code (?lobi=CODE) — auto-joins once a nickname exists. */
  lobbyCode?: string;
}

interface MatchViewProps {
  game: ShellGame;
  session: PlaySession;
  match: MatchState;
  canMove: boolean;
  onMove(move: unknown): void;
  rematchRequested: boolean;
  onRematch(): void;
  onLeave(): void;
}

interface StatusBarProps {
  game: GameDef<unknown, unknown>;
  names: string[];
  you: PlayerIndex;
  code: string;
  status: GameStatus;
  turn: PlayerIndex | null;
  peerLeft: boolean;
  onLeave(): void;
}

interface PlayerChipProps {
  name: string;
  label: string;
  index: PlayerIndex;
  isMe: boolean;
  isTurn: boolean;
}

interface ConnectingCardProps {
  attempt: number;
}

interface ErrorCardProps {
  message: string;
  onBack(): void;
}

/** The two phases that keep a board on screen. */
type PlaySession = Extract<
  LobbySessionState,
  { phase: "playing" | "peer-left" }
>;
