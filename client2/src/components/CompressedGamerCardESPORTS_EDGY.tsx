import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import config from "../config";
import { btDuplicateTabs, btLatency, btLoggedIn, btUser, btWebsocketConnected } from "@/actions/buckets";
import { useBuckets } from "@/actions/bucket";
import { logout } from "@/actions/person";
import { openSaveProfileModal } from "./SignInPane";

export function CompressedGamerCard({isPlayRoute}: {isPlayRoute: boolean}) {
    let [loggedIn, player, latency, wsConnected, duplicatetabs] = useBuckets([btLoggedIn, btUser, btLatency, btWebsocketConnected, btDuplicateTabs]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    if (!loggedIn || !player) return <></>

    // Temp accounts have no email and no github
    const isTempAccount = !player.email && !player.github;

    const handleMenuBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!menuRef.current?.contains(e.relatedTarget as Node)) {
            setMenuOpen(false);
        }
    };

    let isOnline = wsConnected && !duplicatetabs;
    const rawLevel = Number(player.level ?? 1);
    const level = Number.isFinite(rawLevel) ? Math.max(1, rawLevel) : 1;
    const levelInt = Math.trunc(level);
    const xpPercent = Math.max(0, Math.min(100, Math.round((level - levelInt) * 100)));


    
    const countrycode = (player.countrycode || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${player.portraitid || 1}-medium.webp`;
    let latencyValue = Number(latency || 0);
    const statusLabel = duplicatetabs ? "Duplicate" : isOnline ? `Online (${latencyValue}ms)` : "Offline";

        let latencyColor = "bg-slate-400";
        if (latencyValue > 400) {
            latencyColor = "bg-orange-400";
        } else if (latencyValue > 200) {
            latencyColor = "bg-yellow-200";
        } else {
            latencyColor = "bg-green-400";
        }
    
        if (!wsConnected || duplicatetabs) {
            latencyColor = "bg-red-600";
        }

    // Placeholder data for demonstration
    const rank = player.rank || "Diamond III";
    const winCount = player.wins ?? 123;
    const lossCount = player.losses ?? 45;
    const winRate = winCount + lossCount > 0 ? Math.round((winCount / (winCount + lossCount)) * 100) : 0;
    const joinDate = player.joined || "2024-01-15";
    const customStatus = player.status || "Ready to play!";

    return (
        <section className="relative">
            {/* Cyan top accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="relative flex items-start gap-3 bg-slate-900 border border-slate-700/60 border-t-0 rounded-b-xl px-2 pt-2 pb-2">
                {/* Left: Avatar column */}
                <div className="relative shrink-0 flex flex-col items-center gap-1">
                    {/* Avatar with cyan glow border */}
                    <div className="relative rounded-lg bg-gradient-to-br from-cyan-500/50 via-slate-600 to-slate-900 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                        <img src={avatarUrl} alt={player.displayname || "Player"} className="h-13 w-13 rounded-[6px] bg-slate-900 object-cover block" />
                        <span
                            className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-slate-900 ${latencyColor}`}
                            title={statusLabel}
                        />
                    </div>
                    {/* Level — HUD frame badge */}
                    <div className="relative flex items-center justify-center w-12 h-8 rounded-[3px] border border-cyan-500/30 bg-slate-800/80 shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                        <div className="text-center leading-none">
                            <div className="text-[7px] font-bold uppercase tracking-widest text-cyan-700">LVL</div>
                            <div className="text-base font-black text-cyan-400 leading-none tabular-nums">{levelInt}</div>
                        </div>
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400" />
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyan-400" />
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyan-400" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400" />
                    </div>
                    {/* Rank badge */}
                    <span className="inline-block rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-lg whitespace-nowrap">{rank}</span>
                </div>

                {/* Right: Info column */}
                <div className="min-w-0 flex-1 w-full">
                    <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                            <h3 className="mt-0.5 truncate text-sm font-black uppercase tracking-[0.1em] text-white leading-tight">
                                {player.displayname || "Player"}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                <img src={flagSrc} alt={`${countrycode} flag`} className="h-[13px] w-[19px] rounded-sm border border-slate-600 object-cover" title={countrycode} />
                                <span>{countrycode}</span>
                            </div>
                        </div>
                        <div ref={menuRef} className="relative z-10 shrink-0" onBlur={handleMenuBlur}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-700 hover:text-slate-300 focus:outline-none transition-colors"
                                aria-label="Menu"
                            >
                                <svg viewBox="0 0 4 16" width="4" height="16" fill="currentColor">
                                    <circle cx="2" cy="2" r="1.5" />
                                    <circle cx="2" cy="8" r="1.5" />
                                    <circle cx="2" cy="14" r="1.5" />
                                </svg>
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 top-7 w-44 rounded-lg bg-slate-800 border border-slate-700 py-1 shadow-xl z-50">
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0 text-slate-400"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        Profile
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-600 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                        Settings
                                        <span className="ml-auto text-[9px] text-slate-600">soon</span>
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-600 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        Stats
                                        <span className="ml-auto text-[9px] text-slate-600">soon</span>
                                    </button>
                                    <div className="my-1 border-t border-slate-700" />
                                    {isTempAccount && (
                                        <button
                                            onClick={() => { setMenuOpen(false); openSaveProfileModal(); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-cyan-400 hover:bg-slate-700 transition-colors"
                                        >
                                            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" /></svg>
                                            Save Profile
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setMenuOpen(false); logout(); }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0 text-slate-400"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* W/L/WR stat badges */}
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-wide">
                        <span className="inline-flex items-center gap-0.5 rounded bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 text-green-400">
                            {winCount}W
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 text-red-400">
                            {lossCount}L
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 text-cyan-400">
                            {winRate}%
                        </span>
                    </div>

                    {/* XP bar — segmented */}
                    <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">XP to next</span>
                            <span className="text-[10px] font-black tabular-nums text-cyan-400">{xpPercent}<span className="text-[8px] text-cyan-700">%</span></span>
                        </div>
                        <div className="flex gap-px">
                            {Array.from({ length: 14 }).map((_, i) => {
                                const segFilled = xpPercent >= ((i + 1) / 14) * 100;
                                const segPartial = !segFilled && xpPercent > (i / 14) * 100;
                                return (
                                    <div
                                        key={i}
                                        className={`h-2 flex-1 rounded-[1px] ${
                                            segFilled
                                                ? 'bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.75)]'
                                                : segPartial
                                                ? 'bg-cyan-600/60'
                                                : 'bg-slate-700/70'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
