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
    const xpPercent =  Math.max(0, Math.min(100, Math.round((level - levelInt) * 100)));
    const portraitSize = 52;
    const progressPadding = 3;
    const progressStroke = 3;
    const progressCanvas = portraitSize + progressPadding * 2;
    const progressRadius = 13;
    const progressRectSize = progressCanvas - progressStroke;
    const progressPerimeter = (2 * (progressRectSize + progressRectSize - (2 * progressRadius)) + (2 * Math.PI * progressRadius));
    const progressDash = (xpPercent / 100) * progressPerimeter;


    
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

    return (
        <section className={`relative `}>
            <div className={`relative flex items-start gap-3 bg-white shadow-md rounded-xl bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 rounded-t-none  px-2 pt-1`}>
                <div className="relative shrink-0">
                    <div className="relative rounded-xl bg-linear-to-br from-slate-300 via-slate-500 to-slate-900/65 p-0.5">
                        <svg
                            viewBox={`0 0 ${progressCanvas} ${progressCanvas}`}
                            className="pointer-events-none absolute -left-[2px] -top-[2px] h-[60px] w-[60px] -rotate-180"
                            aria-hidden="true"
                        >
                            <defs>
                                <filter id="xp-sparkle-glow" x="-150%" y="-150%" width="400%" height="400%">
                                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Track */}
                            <rect
                                x={progressStroke / 2}
                                y={progressStroke / 2}
                                width={progressRectSize}
                                height={progressRectSize}
                                rx={progressRadius}
                                fill="none"
                                stroke="var(--color-slate-800)"
                                strokeWidth={progressStroke}
                            />
                            {/* Progress fill */}
                            <rect
                                x={progressStroke / 2}
                                y={progressStroke / 2}
                                width={progressRectSize}
                                height={progressRectSize}
                                rx={progressRadius}
                                fill="none"
                                stroke="var(--color-blue-500)"
                                strokeWidth={progressStroke}
                                strokeDasharray={`${progressDash} ${Math.max(progressPerimeter - progressDash, 0)}`}
                                strokeLinecap="round"
                            />
                            {/* Sparkle: soft outer glow aura */}
                            {xpPercent > 1 && (
                                <rect
                                    x={progressStroke / 2}
                                    y={progressStroke / 2}
                                    width={progressRectSize}
                                    height={progressRectSize}
                                    rx={progressRadius}
                                    fill="none"
                                    stroke="rgba(147,197,253,0.7)"
                                    strokeWidth={progressStroke + 4}
                                    strokeDasharray={`2 ${progressPerimeter + 100}`}
                                    strokeDashoffset={-(progressDash - 1)}
                                    strokeLinecap="round"
                                    filter="url(#xp-sparkle-glow)"
                                />
                            )}
                            {/* Sparkle: bright white core dot */}
                            {xpPercent > 1 && (
                                <rect
                                    x={progressStroke / 2}
                                    y={progressStroke / 2}
                                    width={progressRectSize}
                                    height={progressRectSize}
                                    rx={progressRadius}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth={progressStroke + 1}
                                    strokeDasharray={`1.5 ${progressPerimeter + 100}`}
                                    strokeDashoffset={-(progressDash - 0.75)}
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>
                        <img src={avatarUrl} alt={player.displayname || "Player"} className="relative h-13 w-13 rounded-xl bg-slate-900 object-cover" />
                        <span
                            className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-0 border-white ${latencyColor}`}
                            title={statusLabel}
                        />
                    </div>
                    {/* <div className="shrink-0 rounded-xl relative top-0.25 text-center flex items-center justify-end leading-none gap-1">
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">Lvl</div>
                        <div className="mt-0.5 text-sm font-black text-slate-900">{levelInt}</div>
                    </div> */}
                </div>
                <div className="min-w-0 flex flex-col flex-1 relative w-full h-full">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="mt-1.5 truncate text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                                {player.displayname || "Player"}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-800">
                                <img src={flagSrc} alt={`${countrycode} flag`} className="h-[14px] w-[21px] rounded-[2px] border border-slate-700 object-cover" title={countrycode} />
                                <span>{countrycode}</span>
                            </div>
                        </div>
                        <div ref={menuRef} className="relative top-1 right-0 z-10" onBlur={handleMenuBlur}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:outline-none"
                                aria-label="Menu"
                            >
                                <svg viewBox="0 0 4 16" width="4" height="16" fill="currentColor">
                                    <circle cx="2" cy="2" r="1.5" />
                                    <circle cx="2" cy="8" r="1.5" />
                                    <circle cx="2" cy="14" r="1.5" />
                                </svg>
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 top-7 w-44 rounded-xl bg-white py-1 shadow-md">
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-200"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0 "><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        Profile
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-400 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                        Settings
                                        <span className="ml-auto text-[9px] text-slate-700">soon</span>
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-400 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        Stats
                                        <span className="ml-auto text-[9px] text-slate-700">soon</span>
                                    </button>
                                    <div className="my-1 border-t border-slate-200" />
                                    {isTempAccount && (
                                        <button
                                            onClick={() => { setMenuOpen(false); openSaveProfileModal(); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                                        >
                                            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" /></svg>
                                            Save Profile
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setMenuOpen(false); logout(); }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-200"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-1 flex items-center justify-start gap-4 text-[10px] font-bold uppercase tracking-wide text-slate-500 pl-4">
                        <div className="flex flex-row justify-center items-center gap-1">
                            <span className="text-[9px] ">W</span>
                            <span className="text-[12px] font-black ">{0}</span>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-1">
                            <span className="text-[9px] ">L</span>
                            <span className="text-[12px] font-black ">{0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
