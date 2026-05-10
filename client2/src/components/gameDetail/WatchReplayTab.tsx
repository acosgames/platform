
import { useEffect, useRef, useState } from "react";
// --- ReplayControls component ---
function ReplayControls({
    playing,
    onPrevState,
    onPlayPause,
    onNextState,
    onReplay
}: {
    playing: boolean;
    onPrevState: () => void;
    onPlayPause: () => void;
    onNextState: () => void;
    onReplay: () => void;
}) {
    return (
        <div className="flex items-center justify-center lg:justify-start mb-2">
            <div className="relative flex  bg-white shadow-md p-2 rounded-xl items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onPrevState}
                    className="inline-flex h-8 w-12 items-center justify-center rounded-xl  border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-slate-100"
                    aria-label="Previous state"
                >
                    <BackwardIcon className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={onPlayPause}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border-0 bg-white text-slate-700 hover:bg-slate-800 hover:text-slate-100 transition-colors `}
                    aria-label={playing ? "Pause" : "Play"}
                >
                    {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                </button>
                <button
                    type="button"
                    onClick={onNextState}
                    className="inline-flex h-8 w-12 items-center justify-center rounded-xl  border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-slate-100"
                    aria-label="Next state"
                >
                    <ForwardIcon className="h-5 w-5" />
                </button>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                    <button
                        type="button"
                        onClick={onReplay}
                        className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-xl  border-slate-200 text-slate-600 bg-white hover:bg-slate-800 hover:text-slate-100"
                        aria-label="Restart replay"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useBucket, useBucketSelector } from "@/actions/bucket";
import { btActivePowerTab, btReplay, btReplays, btRooms, btScreenBreakpoint } from "@/actions/buckets";
import { downloadGameReplay, findGameReplays, pauseReplay, replayNextIndex, replayPrevIndex, replaySendGameStart, resumeReplay } from "@/actions/replay";
import { findGamePanelByRoom } from "@/actions/room";
import { ArrowPathIcon, BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { ScoreboardPane } from "../ScoreboardPane";
import GamePanel from "../gameScreen/GamePanel";

interface WatchReplayTabProps {
    gameSlug: string;
}


export function WatchReplayTab({ gameSlug }: WatchReplayTabProps) {
    const [activeReplayIndex, setActiveReplayIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<number | null>(null);
    const replays = useBucketSelector(btReplays, (replays) => replays[gameSlug]) || [];

    const gameParentRef = useRef<HTMLDivElement>(null);

    const breakpoint = useBucket(btScreenBreakpoint);
    const sidebarOpen = useBucket(btActivePowerTab);
    const gamepanel = useBucketSelector(btReplay, (replays) => replays[gameSlug]);

    // const replayId = useBucket(btReplay);
    // const gamepanel = findGamePanelByRoom(room_slug as string);

    // Load replays on mount
    useEffect(() => {
        if (!replays || replays.length === 0) {
            setLoading(true);
            findGameReplays(gameSlug).finally(() => setLoading(false));
        }
    }, [gameSlug]);

    // Download replay file and spawn GamePanel when replay changes
    useEffect(() => {
        // if (replays && replays.length > 0 && replays[activeReplayIndex]) {
        //     downloadGameReplay(replays[activeReplayIndex]);
        // }
        // Stop timer when switching replays
        setPlaying(true);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [activeReplayIndex, replays]);

    // Timer loop for auto-advancing replay state
    useEffect(() => {
        if (!playing) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        // timerRef.current = setInterval(() => {
        //     const activeReplay = replays[activeReplayIndex];
        //     if (!activeReplay) return;
        //     // Use the replay room_slug as used in downloadGameReplay
        //     // const roomSlug = "REPLAY/" + activeReplay.room_slug + "/" + activeReplay.game_slug;
        //     replayNextIndex(activeReplay.room_slug);
        // }, 1200); // Advance every 1.2s (adjust as needed)
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [playing, activeReplayIndex, replays]);

    if (loading) {
        return <div className="py-8 text-center text-slate-500">Loading replays...</div>;
    }

    if (!replays || replays.length === 0) {
        return <div className="py-8 text-center text-slate-500">No replays found for this game.</div>;
    }

    if (!gamepanel) {
        return <div className="py-8 text-center text-slate-500">Loading replay...</div>;
    }

    let room_slug = gamepanel?.room?.room_slug;
    const activeReplay = gamepanel?.room;//replays[activeReplayIndex];
    const roomSlug = activeReplay.room_slug; //"REPLAY/" + activeReplay.room_slug + "/" + activeReplay.game_slug;
    // const gamepanel = findGamePanelByRoom(activeReplay.replayId);
    const gamestate = gamepanel?.gamestate;
    // Determine matchType for ScoreboardPane
    let matchType: "free-for-all" | "1v1" | "team-based" = "free-for-all";
    if (gamestate?.room?.mode === "1v1" || gamestate?.room?.mode === "duel") matchType = "1v1";
    if (gamestate?.room?.mode === "team" || gamestate?.room?.mode === "team-based") matchType = "team-based";

    // UI handlers
    const handlePrevReplay = () => setActiveReplayIndex((i) => Math.max(0, i - 1));
    const handleNextReplay = () => setActiveReplayIndex((i) => Math.min(replays.length - 1, i + 1));
    const handlePrevState = () => {
        replayPrevIndex(roomSlug);

        if (playing) {
            pauseReplay(roomSlug);

            setPlaying(false)
        }

    };
    const handleNextState = () => {
        replayNextIndex(roomSlug);
        if (playing) {
            pauseReplay(roomSlug);

            setPlaying(false)
        }
    }
    const handlePlayPause = () => {
        if (playing) {
            pauseReplay(roomSlug);
        }
        else {
            resumeReplay(roomSlug);
        }
        setPlaying((p) => !p)
    };
    const handleReplay = () => {
        // Re-trigger current state (jump to start)
        if (gamepanel && gamestate) {
            // Find gamestart index and jump
            // This is a simplified version; you may want to use replaySendGameStart
            setPlaying(true)
            replaySendGameStart(roomSlug);

        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-2 rounded-lg shadow-sm container">
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-between bg-slate-200 p-2 rounded-lg">
                    <div className="flex-1 min-w-0">
                        <div className="truncate text-[11px] font-semibold text-slate-700">
                            Room: <span className="text-slate-900">{activeReplay.room_slug}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                            Version: {activeReplay.version} • Mode: {activeReplay.mode} • Rating: {activeReplay.rating}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrevReplay}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 border border-slate-200"
                            aria-label="Previous replay"
                            disabled={activeReplayIndex === 0}
                        >
                            <BackwardIcon className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-slate-700">
                            {activeReplayIndex + 1} / {replays.length}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextReplay}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 border border-slate-200"
                            aria-label="Next replay"
                            disabled={activeReplayIndex === replays.length - 1}
                        >
                            <ForwardIcon className="h-4 w-4" />
                        </button>
                    </div>

                </div>
            </div>
            {/* <div className="grid grid-cols-12 gap-1 md:gap-4">
                <div className="col-span-0 xl:col-span-1"></div>
               <div className={`col-span-12 sm:col-span-6   ${breakpoint === 'md' && sidebarOpen != null ? 'md:col-span-12' : 'md:col-span-6'} lg:col-span-7 flex flex-col justify-center items-center`}>

            <ReplayControls
                playing={playing}
                onPrevState={handlePrevState}
                onPlayPause={handlePlayPause}
                onNextState={handleNextState}
                onReplay={handleReplay}
            />
    </div> */}
            {/* </div> */}
            <div className="grid grid-cols-12 gap-1 md:gap-4">
                <div className="hidden md:block lg:hidden xl:hidden col-span-2 xl:col-span-1"></div>
                <div ref={gameParentRef} className={`  col-span-12 md:col-span-6 md:mt-0  ${breakpoint === 'md' && sidebarOpen != null ? 'md:col-span-8 md:mt-0' : 'md:col-span-6'} lg:col-span-6 xl:col-span-6 flex flex-col justify-end items-end`}>
                    
                    <GamePanel wrapperClassName={`${ (breakpoint === 'md' && sidebarOpen != null) ? "justify-start items-center" : "justify-start items-end"}`} canvasRef={gameParentRef} id={String(gamepanel.id)} prioritizeWidth={false} />
                </div>
                <div className="hidden md:block lg:hidden xl:hidden col-span-2 xl:col-span-1"></div>
                {/* Scoreboard rendered from live gamestate */}
                <div className={`min-w-1/2 col-span-12 md:col-span-12 ${breakpoint === 'md' && sidebarOpen != null ? 'sm:col-span-12 sm:px-8 ' : 'md:col-span-6'} lg:col-span-6 xl:col-span-6`}>
                    <div className="w-auto "><ReplayControls
                playing={playing}
                onPrevState={handlePrevState}
                onPlayPause={handlePlayPause}
                onNextState={handleNextState}
                onReplay={handleReplay}
            /></div>
                    {gamestate ? (
                        <ScoreboardPane roomSlug={roomSlug} />
                    ) : (
                        <div className="text-center text-slate-400 text-xs">No game state loaded yet.</div>
                    )}
                </div>
            </div>


            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm mt-2">
                <div className="font-bold text-slate-900 mb-1">Replay Info</div>
                <div className="text-xs text-slate-700">
                    <div>Room Slug: <span className="font-mono">{activeReplay.room_slug}</span></div>
                    <div>Version: {activeReplay.version}</div>
                    <div>Mode: {activeReplay.mode}</div>
                    <div>Rating: {activeReplay.rating}</div>
                    <div>Screen: {activeReplay.screentype} ({activeReplay.resow}x{activeReplay.resoh}) width: {activeReplay.screenwidth}</div>
                    <div>CSS: <span className="font-mono">{activeReplay.css}</span></div>
                </div>
            </div>


        </div>
    );
}
