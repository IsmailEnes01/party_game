// Pre-game panels for the shell: the nickname gate, the create/join lobby
// panel, and the host's waiting room (big code + copyable invite link). All
// presentational with local form state only — the shell owns the session.

import { useEffect, useState } from "react";
import { isValidLobbyCode, LOBBY_CODE_LENGTH } from "@/shared/lib/lobby-code";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";

// ── Components ────────────────────────────────────────────────────────────────

/** First-visit (or "Değiştir") prompt — the nickname rides the WS URL. */
export function NicknameGate({
  initialName,
  onSave,
  onCancel,
}: NicknameGateProps) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-lg">Takma adını seç</CardTitle>
        <CardDescription>Rakibin seni bu adla görecek.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed !== "") onSave(trimmed);
          }}
        >
          <Input
            autoFocus
            value={name}
            maxLength={20}
            placeholder="ör. Ayşe"
            aria-label="Takma ad"
            onChange={(event) => setName(event.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={trimmed === ""}
            >
              Devam
            </Button>
            {onCancel !== undefined && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={onCancel}
              >
                Vazgeç
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/** Create-or-join: "Lobi kur" mints a code, "Koda katıl" dials a shared one. */
export function LobbyPanel({
  nickname,
  initialCode,
  onEditNickname,
  onCreate,
  onJoin,
}: LobbyPanelProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const normalized = code.trim().toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Takma adın:{" "}
        <span className="font-medium text-foreground">{nickname}</span>{" "}
        <Button variant="ghost" size="xs" onClick={onEditNickname}>
          Değiştir
        </Button>
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Lobi kur</CardTitle>
          <CardDescription>
            Sana 4 harflik bir kod verelim — arkadaşın katıldığı anda oyun
            başlar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" onClick={onCreate}>
            Lobi kur
          </Button>
        </CardContent>
      </Card>

      <div
        aria-hidden="true"
        className="flex items-center gap-3 text-xs text-muted-foreground"
      >
        <span className="h-px flex-1 bg-border" />
        veya
        <span className="h-px flex-1 bg-border" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Koda katıl</CardTitle>
          <CardDescription>
            Arkadaşının paylaştığı 4 harflik kodu gir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (isValidLobbyCode(normalized)) onJoin(normalized);
            }}
          >
            <Input
              value={code}
              maxLength={LOBBY_CODE_LENGTH}
              placeholder="KODU"
              aria-label="Lobi kodu"
              autoComplete="off"
              spellCheck={false}
              className="text-center font-mono text-lg tracking-[0.4em] uppercase"
              onChange={(event) => setCode(event.target.value.toUpperCase())}
            />
            <Button type="submit" disabled={!isValidLobbyCode(normalized)}>
              Katıl
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/** Host's waiting room: the code front and center, the invite link a click
 * away, player count, and a start button for the host. */
export function WaitingPanel({
  code,
  gameId,
  onCancel,
  minPlayers,
  playerCount,
  isHost,
  onStart,
}: WaitingPanelProps) {
  const canStart = isHost && playerCount >= minPlayers;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="items-center text-center">
        <CardTitle>Lobi hazır!</CardTitle>
        <CardDescription>
          {isHost
            ? "Davet bağlantısını paylaş — oyuncular katıldığında 'Oyunu Başlat' butonu aktif olacak."
            : "Oyun kurucusu oyunu başlatınca başlayacak."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p
          aria-label={`Lobi kodu: ${code}`}
          className="font-mono text-5xl font-black tracking-[0.3em]"
        >
          {code}
        </p>
        <InviteLink code={code} gameId={gameId} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" /> {playerCount} oyuncu bağlandı
          {minPlayers > 2 && <span> (min. {minPlayers})</span>}
        </div>
        {isHost && (
          <Button
            size="lg"
            className="w-full"
            onClick={onStart}
            disabled={!canStart}
          >
            {canStart ? "Oyunu Başlat" : `En az ${minPlayers} oyuncu gerekiyor`}
          </Button>
        )}
        <Button variant="ghost" onClick={onCancel}>
          İptal
        </Button>
      </CardContent>
    </Card>
  );
}

/** Readonly invite URL + clipboard button (auto-join lands on ?lobi=CODE). */
function InviteLink({ code, gameId }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const link = buildInviteLink(code, gameId);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (link === null) return null;

  async function copy(url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked — the field stays selectable for manual copy.
    }
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        readOnly
        value={link}
        aria-label="Davet bağlantısı"
        className="font-mono text-xs"
        onFocus={(event) => event.target.select()}
      />
      <Button
        variant="outline"
        className="shrink-0"
        onClick={() => void copy(link)}
      >
        {copied ? "Kopyalandı ✓" : "Kopyala"}
      </Button>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Absolute ?lobi=CODE link for this room — null during SSR (no origin). */
function buildInviteLink(code: string, gameId: string): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.origin}/oyun/${gameId}?lobi=${code}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface NicknameGateProps {
  initialName: string;
  onSave(name: string): void;
  /** Present only when editing an existing name (first visit can't cancel). */
  onCancel?(): void;
}

interface LobbyPanelProps {
  nickname: string;
  /** Prefill for the join input (e.g. an invite code after a leave). */
  initialCode?: string;
  onEditNickname(): void;
  onCreate(): void;
  onJoin(code: string): void;
}

interface WaitingPanelProps {
  code: string;
  gameId: string;
  onCancel(): void;
  minPlayers: number;
  playerCount: number;
  isHost: boolean;
  onStart(): void;
}

interface InviteLinkProps {
  code: string;
  gameId: string;
}
