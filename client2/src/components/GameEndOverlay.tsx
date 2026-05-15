import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { GameStatus } from "@acosgames/framework";
import config from "../config";
import { btGame, btGamePanels, btPrimaryGamePanel, btPrimaryState, btUser } from "@/actions/buckets";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import { clearRoom } from "@/actions/room";
import { wsJoinGame } from "@/actions/ws";

type Screen = "result" | "stats";
type EndType = "win" | "lose" | "error" | "noshow" | "forfeit" | "cancelled" | null;

interface GameEndOverlayProps {
    gameSlug: string;
    roomSlug: string | null;
}

export function GameEndOverlay({ gameSlug, roomSlug }: GameEndOverlayProps) {
    const navigate = useNavigate();
    const player = useBucket(btUser) as any;
    const gamestate = useBucket(btPrimaryState) as any;
    const game = useBucket(btGame) as any;
    const primaryId = useBucket(btPrimaryGamePanel) as number | null;

    const isForfeit = useBucketSelector(btGamePanels, (panels: any) => {
        if (primaryId == null) return false;
        return panels?.[primaryId]?.forfeit ?? false;
    }) as boolean;

    const [screen, setScreen] = useState<Screen>("result");
    const [barStarted, setBarStarted] = useState(false);
    const [popped, setPopped] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const prevRoomSlugRef = useRef<string | null>(null);

    // Reset when room changes
    useEffect(() => {
        if (roomSlug !== prevRoomSlugRef.current) {
            prevRoomSlugRef.current = roomSlug;
            setDismissed(false);
            setScreen("result");
            setBarStarted(false);
            setPopped(false);
        }
    }, [roomSlug]);

    const status = gamestate?.room?.status;
    const events: any[] = gamestate?.room?.events ?? [];
    const hasNoshow = events.some((e: any) => e.type === "noshow");
    const hasGameError = events.some((e: any) => e.type === "gameerror");

    let endType: EndType = null;
    if (!dismissed) {
        if (hasNoshow) {
            endType = "noshow";
        } else if (isForfeit) {
            endType = "forfeit";
        } else if (status === GameStatus.gameerror || hasGameError) {
            endType = "error";
        } else if (status === GameStatus.gamecancelled) {
            endType = "cancelled";
        } else if (status === GameStatus.gameover) {
            const players: any[] = gamestate?.players ?? [];
            const local = gamestate?.local;
            if (local && players.length > 0) {
                const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
                endType = sorted[0]?.shortid === local.shortid ? "win" : "lose";
            } else {
                endType = "lose";
            }
        }
    }

    // XP data from player bucket (level is fractional: integer = level, decimal = xp progress)
    const rawLevel = Number(player?.level ?? 1);
    const levelNum = Number.isFinite(rawLevel) ? Math.max(1, rawLevel) : 1;
    const levelInt = Math.trunc(levelNum);
    const xpPercent = Math.max(0, Math.min(100, Math.round((levelNum - levelInt) * 100)));

    // Game stat definitions (scoreboard stats only)
    const statsOptions = (game?.stats ?? []).filter((s: any) => s.isactive && s.scoreboard === 1);
    const local = gamestate?.local;

    // Start bar animation after a short delay so the title reveals first
    useEffect(() => {
        if (endType !== "win" && endType !== "lose") return;
        setBarStarted(false);
        setPopped(false);
        const t = window.setTimeout(() => setBarStarted(true), 550);
        return () => window.clearTimeout(t);
    }, [endType, roomSlug]);

    if (!endType) return null;

    const handlePlayAgain = () => {
        setDismissed(true);
        wsJoinGame("rank", gameSlug);
        navigate(`/game/${gameSlug}`);
    };

    const handleLeave = () => {
        setDismissed(true);
        if (roomSlug) clearRoom(roomSlug);
        navigate(`/game/${gameSlug}`);
    };

    const isResultScreen = endType === "win" || endType === "lose";
    const isWin = endType === "win";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
            <div className="animate-in fade-in zoom-in-95 duration-300 bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md mx-4 overflow-hidden">

                {/* ── Error / Cancelled ── */}
                {(endType === "error" || endType === "cancelled") && (
                    <SpecialEndScreen
                        icon={<ErrorIcon />}
                        iconRing="ring-red-200 bg-red-50"
                        title="Game Error"
                        message="The game encountered an error and was cancelled. Please try again."
                        onPlayAgain={handlePlayAgain}
                        onLeave={handleLeave}
                    />
                )}

                {/* ── No Show ── */}
                {endType === "noshow" && (
                    <SpecialEndScreen
                        icon={<NoShowIcon />}
                        iconRing="ring-yellow-200 bg-yellow-50"
                        title="No Show"
                        message="One or more players failed to connect to the match. The game has been cancelled."
                        onPlayAgain={handlePlayAgain}
                        onLeave={handleLeave}
                    />
                )}

                {/* ── Forfeit ── */}
                {endType === "forfeit" && (
                    <SpecialEndScreen
                        icon={<ForfeitIcon />}
                        iconRing="ring-orange-200 bg-orange-50"
                        title="Match Forfeited"
                        message="A player forfeited the match."
                        onPlayAgain={handlePlayAgain}
                        onLeave={handleLeave}
                    />
                )}

                {/* ── Win / Lose — Result screen ── */}
                {isResultScreen && screen === "result" && (
                    <div className="flex flex-col items-center">
                        {/* Coloured banner header */}
                        <div className={`w-full px-8 pt-8 pb-5 flex flex-col items-center ${isWin ? "bg-linear-to-b from-emerald-50 to-white" : "bg-linear-to-b from-rose-50 to-white"}`}>
                            <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ring-2 ${isWin ? "ring-emerald-300 bg-emerald-100" : "ring-rose-300 bg-rose-100"}`}>
                                {isWin ? <TrophyIcon /> : <SkullIcon />}
                            </div>
                            <h2 className={`text-4xl font-black tracking-tight leading-none ${isWin ? "text-emerald-600" : "text-rose-500"}`}>
                                {isWin ? "You Win!" : "You Lost"}
                            </h2>
                            {local && (
                                <div className="mt-2 flex items-center gap-2">
                                    <img
                                        src={`${config.https.cdn}images/portraits/assorted-${local.portraitid || 1}-medium.webp`}
                                        alt={local.displayname}
                                        className="h-6 w-6 rounded-lg object-cover border border-slate-200"
                                    />
                                    <span className="text-sm font-semibold text-slate-600">{local.displayname}</span>
                                    {local.score != null && (
                                        <span className="text-sm font-black text-slate-800">{Number(local.score).toLocaleString()} pts</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* XP bar */}
                        <div className="w-full px-8 pb-2">
                            <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Level {levelInt}</span>
                                <span className="text-[10px] font-bold text-blue-500">{xpPercent}%</span>
                            </div>
                            <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                                {/* Progress fill */}
                                <div
                                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-1400 ease-out"
                                    style={{ width: barStarted ? `${xpPercent}%` : "0%" }}
                                    onTransitionEnd={() => {
                                        if (barStarted) {
                                            setPopped(true);
                                            window.setTimeout(() => setPopped(false), 900);
                                        }
                                    }}
                                />
                                {/* Sparkle leading-edge dot */}
                                {barStarted && xpPercent > 3 && (
                                    <div
                                        className="absolute inset-y-0 w-3 pointer-events-none transition-all duration-1400 ease-out"
                                        style={{ left: `calc(${xpPercent}% - 6px)` }}
                                    >
                                        <div className={`h-full rounded-full transition-all duration-300 ${popped ? "bg-white shadow-[0_0_12px_6px_rgba(255,255,255,0.95)]" : "bg-white/50 blur-[1px]"}`} />
                                    </div>
                                )}
                            </div>
                            {popped && (
                                <p className="mt-1.5 text-center text-[11px] font-black text-cyan-500 animate-bounce">
                                    ✨ XP progress saved!
                                </p>
                            )}
                            {!popped && <div className="mt-1.5 h-4.5" />}
                        </div>

                        {/* View Stats link + action buttons */}
                        <div className="w-full px-8 pb-7 flex flex-col items-center gap-3">
                            <button
                                onClick={() => setScreen("stats")}
                                className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                            >
                                View Match Stats
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <ActionButtons onPlayAgain={handlePlayAgain} onLeave={handleLeave} />
                        </div>
                    </div>
                )}

                {/* ── Win / Lose — Stats screen ── */}
                {isResultScreen && screen === "stats" && (
                    <div className="px-8 py-7">
                        <div className="flex items-center justify-between mb-5">
                            <button
                                onClick={() => setScreen("result")}
                                className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h3 className="text-sm font-bold text-slate-700">Match Summary</h3>
                            <div className="w-14" />
                        </div>

                        {/* Score card */}
                        <div className="mb-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Score</p>
                            <p className="text-3xl font-black text-slate-900 tabular-nums">{(local?.score ?? 0).toLocaleString()}</p>
                        </div>

                        {/* Stat grid */}
                        {statsOptions.length > 0 && local?.stats ? (
                            <div className="grid grid-cols-2 gap-2">
                                {statsOptions.map((s: any) => {
                                    const val = local.stats?.[s.stat_abbreviation];
                                    if (val == null) return null;
                                    return (
                                        <div key={s.stat_slug} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center">
                                            <p className="text-[10px] font-semibold text-slate-400 truncate">{s.stat_name}</p>
                                            <p className="mt-0.5 text-xl font-black text-slate-900 tabular-nums">{Number(val).toLocaleString()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-center text-slate-400 py-4">No stats available for this match.</p>
                        )}

                        <div className="mt-4">
                            <ActionButtons onPlayAgain={handlePlayAgain} onLeave={handleLeave} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function ActionButtons({ onPlayAgain, onLeave }: { onPlayAgain: () => void; onLeave: () => void }) {
    return (
        <div className="flex items-center justify-center gap-3 w-full">
            <button
                onClick={onLeave}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
                Leave
            </button>
            <button
                onClick={onPlayAgain}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md transition-all"
            >
                Play Again
            </button>
        </div>
    );
}

function SpecialEndScreen({ icon, iconRing, title, message, onPlayAgain, onLeave }: {
    icon: React.ReactNode;
    iconRing: string;
    title: string;
    message: string;
    onPlayAgain: () => void;
    onLeave: () => void;
}) {
    return (
        <div className="flex flex-col items-center px-8 py-10 text-center">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-2 ${iconRing}`}>
                {icon}
            </div>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">{message}</p>
            <div className="mt-7">
                <ActionButtons onPlayAgain={onPlayAgain} onLeave={onLeave} />
            </div>
        </div>
    );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function TrophyIcon() {
    return (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h12v6a6 6 0 01-12 0V2zM6 8a6 6 0 004 5.66V16H8v2h8v-2h-2v-2.34A6 6 0 0018 8M3 4H6M18 4h3" />
        </svg>
    );
}

function SkullIcon() {
    return (
        <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 00-7 7c0 2.64 1.46 4.96 3.63 6.22V17h6.74v-1.78A7 7 0 0012 2zM9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1M9.5 11a.5.5 0 110-1 .5.5 0 010 1zM14.5 11a.5.5 0 110-1 .5.5 0 010 1z" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
    );
}

function NoShowIcon() {
    return (
        <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 11l-3 3m0-3l3 3" />
        </svg>
    );
}

function ForfeitIcon() {
    return (
        <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l4-2 4 2 4-2 4 2v14l-4-2-4 2-4-2-4 2V4z" />
        </svg>
    );
}
