import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowsPointingOutIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Clapperboard } from "lucide-react";
import { PlayerScreen } from "../components/PlayerScreen";
import type { IntroPlayer } from "../components/IntroPlayerCard";
import GamePanel from "../components/gameScreen/GamePanel";
import { btDisplayMode, btGame, btMainScrollRef, btPrimaryGamePanel, btPrimaryRoom, btPrimaryState, btTimeleft } from "@/actions/buckets";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import config from "../config";
import { GameStatus } from "@acosgames/framework";
import { addJoinQueues } from "@/actions/queue";
import { wsJoinGame, wsJoinQueues } from "@/actions/ws";
import { Tooltip } from "@/components/ui/Tooltip";

type MatchType = "free-for-all" | "1v1" | "team-based";

function rankLetter(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}

export function PlayScreen() {
  const COUNTDOWN_DURATION_MS = 5000;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playSurfaceRef = useRef<HTMLElement | null>(null);

  const mainScrollRef = useBucket(btMainScrollRef);


  const primary = useBucket(btPrimaryGamePanel);
  const room = useBucket(btPrimaryRoom) as any;
  const gamestate = useBucket(btPrimaryState) as any;
  const game = useBucket(btGame) as any;
  const timeleft = useBucketSelector(btTimeleft, (bucket) => {
    if (primary == null) return undefined;
    return (bucket as Record<string | number, number | undefined>)[primary];
  }) as number | undefined;
  const gameSlug = game?.game_slug ?? id;

  // Loading timeout — after 6s with no primary panel, show error
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  useEffect(() => {
    if (typeof primary === "number") { setLoadingTimedOut(false); return; }
    const t = window.setTimeout(() => setLoadingTimedOut(true), 4000);
    return () => window.clearTimeout(t);
  }, [primary]);

  const defaultShowVsScreen = room && gamestate && gamestate?.room && gamestate?.room?.status !== GameStatus.gamestart;
  const [showVsScreen, setShowVsScreen] = useState(defaultShowVsScreen);
  const [vsExiting, setVsExiting] = useState(false);
  const displayMode = useBucket(btDisplayMode);
  const isTheaterMode = displayMode === "theatre";
  const isFullscreen = displayMode === "fullscreen";

  // Hide VS screen when game actually starts
  const gameStatus = gamestate?.room?.status;
  const secondsRemaining = Math.ceil((timeleft ?? 0) / 1000);
  const revealBackgroundDuringCountdown =
    vsExiting || (gameStatus === GameStatus.starting && secondsRemaining <= 2);

  useEffect(() => {
    if (gameStatus === GameStatus.gamestart && showVsScreen) {
      setVsExiting(true);
      const timer = window.setTimeout(() => setShowVsScreen(false), 680);
      return () => window.clearTimeout(timer);
    }
  }, [gameStatus]);

  // Fallback countdown to hide VS screen
  useEffect(() => {
    if (!showVsScreen) return;
    const startExitTimer = window.setTimeout(() => setVsExiting(true), COUNTDOWN_DURATION_MS);
    const hideTimer = window.setTimeout(() => setShowVsScreen(false), COUNTDOWN_DURATION_MS + 680);
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
      if (!document.fullscreenElement) {
        btDisplayMode.set("normal");
      }
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

  // — All hooks above this line —

  const handleQueue = () => {
    if (!gameSlug) return;
    wsJoinGame("rank", gameSlug);
    // addJoinQueues(gameSlug, "public");
    // wsJoinQueues([{ game_slug: gameSlug, mode: "public" }], null);
    navigate(`/game/${gameSlug}`);
  };

  // Loading overlay
  if (!showVsScreen && typeof primary !== "number" && !loadingTimedOut) {
    return (
      <div className="container mx-auto px-2 lg:px-8 xl:px-20  py-16">
      <div className="flex flex-col items-center justify-center min-h-64 gap-4  ">
        <div className="w-10 h-10 rounded-full border-4 border-slate-600 border-t-cyan-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Connecting to game session&hellip;</p>
      </div>
      </div>
    );
  }

  // No room found overlay
  if (!showVsScreen && typeof primary !== "number") {
    return (
      <div className="container mx-auto px-2 lg:px-8 xl:px-20 py-8">
      <div className="flex bg-white rounded-lg p-2 min-h-64">
        <div className="flex bg-slate-200 w-full flex-col items-center justify-center  gap-5 py-16">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-500 border border-red-500/30">
            <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-600">No game session found</p>
            <p className="mt-1 text-sm text-slate-600">The room may have ended or the link is invalid.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleQueue}
              className="px-5 py-2 rounded-md text-sm font-semibold text-white bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-colors"
            >
              Join Queue
            </button>
            <button
              type="button"
              onClick={() => navigate(gameSlug ? `/game/${gameSlug}` : "/")}
              className="px-5 py-2 rounded-md text-sm font-semibold text-slate-700 border border-slate-600 hover:border-slate-400 hover:text-white transition-colors"
            >
              Back to Game Page
            </button>
          </div>
        </div>
      </div>
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
      btDisplayMode.set("normal");
      return;
    }
    await playSurfaceRef.current?.requestFullscreen();
    btDisplayMode.set("fullscreen");
  };

  return (
    <div className="space-y-3 ">
      <section ref={playSurfaceRef} className={`relative overflow-hidden min-h-full ${!isTheaterMode && !isFullscreen ? "p-2 md:p-0" : ""} `}>
        <GamePanel wrapperClassName={`${isTheaterMode || isFullscreen ? "items-center justify-center":  "items-center justify-start"}`} id={String(primary)} prioritizeWidth hideInBackground={showVsScreen && !revealBackgroundDuringCountdown}>

          
        </GamePanel>
        <PlayerScreen
          room={room}
          matchType={matchType}
          displayedPlayers={displayedPlayers}
          cardMotionPhase={cardMotionPhase}
          countdownDurationMs={COUNTDOWN_DURATION_MS}
          showVsScreen={showVsScreen}
          vsExiting={vsExiting}
        />

      <div className="container flex items-end justify-end gap-3 px-1 py-4">
        <div className="flex items-center justify-center gap-2 w-full ">
          <Tooltip            content={isTheaterMode ? "Standard View" : "Theatre Mode"}>
            
          <button
            type="button"
            onClick={() => {
              if (mainScrollRef?.current) {
                mainScrollRef.current?.scrollTo(0, 0);
              }
              btDisplayMode.set(isTheaterMode ? "normal" : "theatre")
            }}
            className={`h-9 w-9 rounded-md border flex items-center justify-center transition-colors ${isTheaterMode
              ? "border-cyan-300/45 bg-slate-100 text-slate-700"
              : "border-white/20 bg-slate-100 text-slate-700 hover:bg-slate-300"
              }`}
            title={isTheaterMode ? "Standard View" : "Theatre Mode"}
            aria-label={isTheaterMode ? "Standard View" : "Theatre Mode"}
          >
            <Clapperboard className="h-5 w-5" />
          </button>
          </Tooltip>
          <Tooltip content={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <button
            type="button"
            onClick={() => { void toggleFullscreen(); }}
            className={`h-9 w-9 rounded-md border flex items-center justify-center transition-colors ${isFullscreen
              ? "border-emerald-300/45 bg-slate-100 text-slate-700"
              : "border-white/20 bg-slate-100 text-slate-700 hover:bg-slate-300"
              }`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </button>
          </Tooltip>
        </div>
        {/* <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full border border-cyan-300/35 bg-cyan-500/10 text-cyan-100 text-[11px] font-semibold uppercase tracking-wide">
            {matchType}
          </span>
          <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/25 text-white/85 text-[11px] font-semibold">
            {playersReady} ready
          </span>
        </div> */}

        
      </div>
      
      </section>
    </div>
  );
}
