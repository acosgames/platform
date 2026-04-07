import { useEffect, useRef, useState } from "react";
import config from "../config";
import { logout } from "@/actions/person";
import { btDuplicateTabs, btLatency, btLoggedIn, btUser, btWebsocketConnected } from "@/actions/buckets";
import { useBuckets } from "@/actions/bucket";


const MENU_OPTIONS = [
    { label: "Edit Profile", icon: "✏️" },
    { label: "View Stats", icon: "📊" },
    { label: "Achievements", icon: "🏆" },
    { label: "Settings", icon: "⚙️" },
    { label: "Sign Out", icon: "🚪", danger: true, onClick: () => logout() },
];

export function CompressedGamerCard() {


    let [loggedIn, player, latency, wsConnected, duplicatetabs] = useBuckets([btLoggedIn, btUser, btLatency, btWebsocketConnected, btDuplicateTabs]);
    
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onOutsideClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) document.addEventListener("mousedown", onOutsideClick);
        return () => document.removeEventListener("mousedown", onOutsideClick);
    }, [menuOpen]);

    
    if(!loggedIn || !player) return <></>
    
    
    let isOnline = wsConnected && !duplicatetabs;

    let level = 1.3;//player.level || 1;
    let xpPercent = Math.max(0, Math.min(100, (level - Math.trunc(level)) * 100));

    const countrycode = (player.countrycode || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${player.portraitid || 1}-medium.webp`;
    const latencyValue = Number(latency || 0);
    // const tierLabel = player.rank || player.tier || player.division || "Contender";
    // const statusLabel = duplicatetabs ? "Duplicate" : isOnline ? "Live" : "Offline";
    // const latencyLabel = !wsConnected ? "Link Down" : duplicatetabs ? "Conflict" : `${latencyValue}ms`;
    // const latencyTone = !wsConnected || duplicatetabs
    //     ? "border-red-500/35 bg-red-500/12 text-red-200"
    //     : latencyValue > 400
    //         ? "border-orange-400/35 bg-orange-500/12 text-orange-200"
    //         : latencyValue > 200
    //             ? "border-yellow-400/35 bg-yellow-500/12 text-yellow-100"
    //             : "border-green-400/35 bg-green-500/12 text-green-100";

    

    return (
        <div className="relative z-10 overflow-visible    bg-card px-3 py-3  ">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%]  bg-[linear-gradient(130deg,rgba(20,98,255,0.82),rgba(0,0,0,0.0)_50%,rgba(240,36,72,0.9))]" />
            <div className="pointer-events-none absolute inset-x-0 top-[60%] h-8 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),transparent)]" />
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <div className="absolute -inset-0.5  bg-linear-to-br from-blue-500/60 via-white/15 to-red-500/60 opacity-80" />
                    <div className="relative  bg-slate-950/85 p-0.5">
                        <img src={avatarUrl} alt={player.displayname} className="h-16 w-16 rounded-md object-cover" />
                    </div>
                    <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card ${isOnline ? "bg-green-400 shadow-[0_0_10px_rgba(96,165,250,0.85)]" : "bg-slate-500"}`}
                        title={`${!wsConnected ? "Disconnected" : `${latencyValue}ms`}`}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              
                                
                            </div>
                            <h3 className="mt-1 truncate text-sm font-black uppercase tracking-[0.08em] text-white">
                                {player.displayname}
                                <img src={flagSrc} alt={`${countrycode} flag`} className="h-3 w-4.5 rounded-[2px] object-cover border border-white/20" title={countrycode} />
                            </h3>
                            {/* <div className="mt-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em]">
                                <span className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 ${isOnline ? "border-blue-400/35 bg-blue-500/12 text-blue-100" : "border-white/12 bg-white/8 text-slate-300"}`}>
                                    {statusLabel}
                                </span>
                                <span className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 ${latencyTone}`}>
                                    {latencyLabel}
                                </span>
                            </div> */}
                        </div>

                        <div className="flex items-start gap-2 shrink-0">
                            {/* <div className="min-w-[2.8rem] rounded-md border border-white/10 bg-white/6 px-2 py-1 text-center leading-none">
                                <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/60">LVL</div>
                                <div className="mt-1 text-sm font-black text-white">{player.level}</div>
                            </div> */}

                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="h-7 w-7 rounded-md border border-white/12 bg-black/25 hover:border-blue-300/40 hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-0.5"
                                    aria-label="Player options"
                                >
                                    <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                                    <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                                    <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-md border border-white/10 bg-popover shadow-2xl shadow-black/50 py-1.5">
                                        {MENU_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.label}
                                                onClick={() => { setMenuOpen(false); opt.onClick?.(); }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/10 text-left ${opt.danger ? "text-destructive hover:bg-destructive/20" : "text-foreground"}`}
                                            >
                                                <span className="text-base leading-none">{opt.icon}</span>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2.5">
                        <div className="mb-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                            <span>Level {player.level}</span>
                            <span>{Math.round(xpPercent)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-blue-500 via-white to-red-500"
                                style={{ width: `${xpPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
