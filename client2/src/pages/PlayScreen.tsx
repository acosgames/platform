import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { Clapperboard } from "lucide-react";
import { PlayerScreen } from "../components/PlayerScreen";
import type { IntroPlayer } from "../components/IntroPlayerCard";
import GamePanel from "../components/gameScreen/GamePanel";
import { btPrimaryGamePanel, btPrimaryRoom, btPrimaryState } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import config from "../config";

type MatchType = "free-for-all" | "1v1" | "team-based";

function rankLetter(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}

export function PlayScreen() {
  const COUNTDOWN_DURATION_MS = 5000;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playSurfaceRef = useRef<HTMLElement | null>(null);

  const primary = useBucket(btPrimaryGamePanel);
  const room = useBucket(btPrimaryRoom) as any;
  const gamestate = useBucket(btPrimaryState) as any;

  const [showVsScreen, setShowVsScreen] = useState(() => gamestate?.room?.status !== "gamestart");
  const [vsExiting, setVsExiting] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hide VS screen when game actually starts
  const gameStatus = gamestate?.room?.status;
  useEffect(() => {
    if (gameStatus === "gamestart" && showVsScreen) {
      setVsExiting(true);
      const timer = window.setTimeout(() => setShowVsScreen(false), 680);
      return () => window.clearTimeout(timer);
    }
  }, [gameStatus]);

  // Fallback countdown to hide VS screen
  useEffect(() => {
    if (!showVsScreen) return;

    const startExitTimer = window.setTimeout(() => {
      setVsExiting(true);
    }, COUNTDOWN_DURATION_MS);

    const hideTimer = window.setTimeout(() => {
      setShowVsScreen(false);
    }, COUNTDOWN_DURATION_MS + 680);

    return () => {
      window.clearTimeout(startExitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [showVsScreen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("play-theater-mode", isTheaterMode);
    return () => { root.classList.remove("play-theater-mode"); };
  }, [isTheaterMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const matchType = useMemo<MatchType>(() => {
    if (!room) return "free-for-all";
    const { maxteams, maxplayers } = room;
    if (maxteams === 2 && maxplayers <= 2) return "1v1";
    if (maxteams > 2) return "team-based";
    return "free-for-all";
  }, [room]);

  const introPlayers = useMemo<IntroPlayer[]>(() => {
    const players = gamestate?.players;
    if (!players) return [];
    return players.map((p: any, idx: number) => ({
      id: p.shortid,
      name: p.displayname,
      country: p.countrycode,
      avatarUrl: `${config.https.cdn}images/portraits/assorted-${p.portraitid || 1}-medium.webp`,
      rankLetter: rankLetter(idx),
      rankLevel: `Rating: ${p.rating}`,
    }));
  }, [gamestate?.players]);

  if (typeof primary !== "number") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Game session not found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-md text-sm font-semibold text-background bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
        >
          Back to Games
        </button>
      </div>
    );
  }

  const gameName = room?.name ?? id ?? "Game";
  const gameImageUrl = room?.preview_images
    ? `${config.https.cdn}g/${room.game_slug}/preview/${room.preview_images}`
    : "";

  const displayedPlayers =
    matchType === "1v1"
      ? introPlayers.slice(0, 2)
      : matchType === "free-for-all"
        ? introPlayers.slice(0, 100)
        : introPlayers.slice(0, 40);

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
    <div className="space-y-3">
      <section ref={playSurfaceRef} className="relative overflow-hidden min-h-full">
        
          {/* Game iframe — rendered behind VS overlay */}
          <GamePanel id={String(primary)} prioritizeWidth />
        {/* </div> */}

        <PlayerScreen
          gameName={gameName}
          gameImageUrl={gameImageUrl}
          matchType={matchType}
          displayedPlayers={displayedPlayers}
          cardMotionPhase={cardMotionPhase}
          countdownDurationMs={COUNTDOWN_DURATION_MS}
          showVsScreen={showVsScreen}
          vsExiting={vsExiting}
        />
      </section>

      <div className="flex items-center justify-between gap-3 px-1 pb-8">
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
            className={`h-9 w-9 rounded-md border flex items-center justify-center transition-colors ${
              isTheaterMode
                ? "border-cyan-300/45 bg-cyan-500/18 text-cyan-50"
                : "border-white/20 bg-black/25 text-white/80 hover:bg-black/45"
            }`}
            title={isTheaterMode ? "Standard View" : "Theatre Mode"}
            aria-label={isTheaterMode ? "Standard View" : "Theatre Mode"}
          >
            <Clapperboard className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className={`h-9 w-9 rounded-md border flex items-center justify-center transition-colors ${
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
