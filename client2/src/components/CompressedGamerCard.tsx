import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import config from "../config";
import { btDuplicateTabs, btLatency, btLoggedIn, btUser, btWebsocketConnected } from "@/actions/buckets";
import { useBuckets } from "@/actions/bucket";
import { logout } from "@/actions/person";
import { openSaveProfileModal } from "./SignInPane";

export function CompressedGamerCard() {
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

    return (
        <section className="relative  rounded-xl  bg-slate-950  shadow-md">
            {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(120deg,rgba(15,23,42,0.05),rgba(6,182,212,0.12)_45%,rgba(59,130,246,0.1))]" /> */}
            <div className="relative flex items-start gap-3 bg-slate-950 rounded-xl px-2 pt-1">

                <div className="relative shrink-0">
                    <div className="relative  rounded-xl bg-linear-to-br from-slate-300 via-slate-500 to-slate-900/65 p-0.5">
                        <img src={avatarUrl} alt={player.displayname || "Player"} className="relative h-13 w-13 rounded-xl  bg-slate-900 object-cover" />
                        <span
                            className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-0 border-white ${latencyColor}`}
                            title={statusLabel}
                        />
                    </div>

                    <div className="shrink-0 rounded-xl pt-0.5 text-center flex items-center justify-end leading-none gap-1">
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Lvl</div>
                        <div className="mt-0.5 text-sm font-black text-slate-50">{levelInt}</div>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            {/* <div className="flex items-center gap-1.5">
                                <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                    {statusLabel}
                                </span>
                                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700">
                                    {latencyValue}ms
                                </span>
                            </div> */}
                            <h3 className="mt-1.5 truncate text-sm font-black uppercase tracking-[0.08em] text-slate-100">
                                {player.displayname || "Player"}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-100">
                                <img src={flagSrc} alt={`${countrycode} flag`} className="h-[16px] w-[23px] rounded-[2px] border border-slate-600 object-cover" title={countrycode} />
                                <span>{countrycode}</span>
                            </div>
                        </div>


                        {/* 3-dot menu */}
                        <div ref={menuRef} className="relative top-1 right-0 z-10" onBlur={handleMenuBlur}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none"
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
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-200"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0 "><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        Profile
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-300 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                        Settings
                                        <span className="ml-auto text-[9px] text-slate-600">soon</span>
                                    </button>
                                    <button
                                        disabled
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-300 cursor-not-allowed"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        Stats
                                        <span className="ml-auto text-[9px] text-slate-600">soon</span>
                                    </button>
                                    <div className="my-1 border-t border-slate-100" />
                                    {isTempAccount && (
                                        <button
                                            onClick={() => { setMenuOpen(false); openSaveProfileModal(); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-cyan-600 hover:bg-cyan-50"
                                        >
                                            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" /></svg>
                                            Save Profile
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setMenuOpen(false); logout(); }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-200"
                                    >
                                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" className="shrink-0"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="mt-0.25">
                        <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-200">
                            {/* <span>Progress</span> */}
                            <span></span>
                            <span>{xpPercent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-linear-to-r from-cyan-500 via-sky-500 to-blue-600" style={{ width: `${xpPercent}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
