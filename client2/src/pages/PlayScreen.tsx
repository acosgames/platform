import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EyeIcon, EyeSlashIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { currentPlayer, games, leaderboard } from "../data/mockData";
import { PlayerScreen } from "../components/PlayerScreen";
import type { IntroPlayer } from "../components/IntroPlayerCard";

type MatchType = "free-for-all" | "1v1" | "team-based";

function getMatchType(id: string): MatchType {
  const n = Number(id);
  if (!Number.isFinite(n)) return "team-based";
  if (n % 3 === 1) return "1v1";
  if (n % 3 === 2) return "free-for-all";
  return "team-based";
}

function rankLetter(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}

export function PlayScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playSurfaceRef = useRef<HTMLElement | null>(null);
  const game = games.find((g) => g.id === id);
  const [countdown, setCountdown] = useState(5000);
  const [showVsScreen, setShowVsScreen] = useState(true);
  const [vsExiting, setVsExiting] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown !== 0 || !showVsScreen) return;

    setVsExiting(true);
    const exitTimer = window.setTimeout(() => {
      setShowVsScreen(false);
    }, 680);

    return () => window.clearTimeout(exitTimer);
  }, [countdown, showVsScreen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("play-theater-mode", isTheaterMode);

    return () => {
      root.classList.remove("play-theater-mode");
    };
  }, [isTheaterMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!game) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Game session not found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-background bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
        >
          Back to Games
        </button>
      </div>
    );
  }

  const matchType = getMatchType(game.id);

  const introPlayers = useMemo<IntroPlayer[]>(() => {
    const rivalEntries = leaderboard.filter((entry) => entry.player !== currentPlayer.name).slice(0, 15);

    return [
      {
        id: currentPlayer.id,
        name: currentPlayer.name,
        country: currentPlayer.country,
        avatarUrl: currentPlayer.avatarUrl,
        rankLetter: "A",
        rankLevel: currentPlayer.rank,
      },
      ...rivalEntries.map((entry, idx) => ({
        id: `lb-${entry.rank}`,
        name: entry.player,
        country: entry.country,
        avatarUrl: `https://i.pravatar.cc/160?img=${idx + 30}`,
        rankLetter: rankLetter(idx + 1),
        rankLevel: `Global #${entry.rank}`,
      })),
    ];
  }, []);

  const displayedPlayers =
    matchType === "1v1"
      ? introPlayers.slice(0, 2)
      : matchType === "free-for-all"
        ? introPlayers.slice(0, 16)
        : introPlayers.slice(0, 6);

  const playersReady = displayedPlayers.length;
  const cardMotionPhase: "enter" | "exit" = vsExiting ? "exit" : "enter";

  const toggleFullscreen = async () => {
    if (!document.fullscreenEnabled) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await playSurfaceRef.current?.requestFullscreen();
  };

  return (
    <div className="space-y-3 pb-4">
      {/* Control bar */}
      

      <section ref={playSurfaceRef} className="relative rounded-2xl overflow-hidden border border-white/10 bg-card min-h-[68vh] play-surface">
        <img src={game.imageUrl} alt={game.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/15 via-transparent to-purple-500/15" />

        <PlayerScreen
          gameName={game.name}
          gameImageUrl={game.imageUrl}
          matchType={matchType}
          displayedPlayers={displayedPlayers}
          cardMotionPhase={cardMotionPhase}
          countdown={countdown}
          showVsScreen={showVsScreen}
          vsExiting={vsExiting}
        />
      </section>

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full border border-cyan-300/35 bg-cyan-500/10 text-cyan-100 text-[11px] font-semibold uppercase tracking-wide">
            {matchType}
          </span>
          <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/25 text-white/85 text-[11px] font-semibold">
            {playersReady} ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTheaterMode((prev) => !prev)}
            className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
              isTheaterMode
                ? "border-cyan-300/45 bg-cyan-500/18 text-cyan-50"
                : "border-white/20 bg-black/25 text-white/80 hover:bg-black/45"
            }`}
            title={isTheaterMode ? "Standard View" : "Theatre Mode"}
            aria-label={isTheaterMode ? "Standard View" : "Theatre Mode"}
          >
            {isTheaterMode ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
              isFullscreen
                ? "border-emerald-300/45 bg-emerald-500/18 text-emerald-50"
                : "border-white/20 bg-black/25 text-white/80 hover:bg-black/45"
            }`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
