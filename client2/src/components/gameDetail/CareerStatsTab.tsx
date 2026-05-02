import { useEffect, useState } from "react";
import { btGame, btPlayerStats, btUser } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import { getPlayerGlobalStats, getPlayerStatHistory } from "@/actions/playerStats";
import { PlayerRankLetter } from "./PlayerRankLetter";

type StatHistoryEntry = { tsinsert: string; value: number };
type GlobalStatRow = {
    stat_slug: string;
    season: number;
    valueINT: number | null;
    valueFLOAT: number | null;
    bestINT: number | null;
    bestFLOAT: number | null;
};

const ACOS_DISPLAY_NAMES: Record<string, string> = {
    ACOS_RATING: "Rating",
    ACOS_WINS: "Wins",
    ACOS_PLAYED: "Matches Played",
    ACOS_PLAYTIME: "Playtime (s)",
    ACOS_SCORE: "Score",
};

export function CareerStatsTab({ gameSlug }: { gameSlug: string }) {
    const game = useBucket(btGame) as GameInfoFull | null;
    const currentPlayer = useBucket(btUser);
    const cp = currentPlayer as any;
    const playerStats = useBucket(btPlayerStats) as Record<string, any>;
    const playerStat = playerStats?.[gameSlug];
    const rating = Number(playerStat?.rating ?? 0);
    const statsOptions = (game?.stats ?? []).filter((s) => s.isactive);

    const [selectedStat, setSelectedStat] = useState("");
    const [statHistory, setStatHistory] = useState<StatHistoryEntry[]>([]);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; tsinsert: string } | null>(null);
    const [globalStats, setGlobalStats] = useState<GlobalStatRow[]>([]);

    useEffect(() => {
        if (!cp?.shortid || !gameSlug || !selectedStat) return;
        getPlayerStatHistory({
            shortid: cp.shortid,
            game_slug: gameSlug,
            stat_slug: selectedStat,
            days: 30,
        }).then(setStatHistory);
    }, [cp?.shortid, gameSlug, selectedStat]);

    useEffect(() => {
        if (!cp?.shortid || !gameSlug) return;
        getPlayerGlobalStats({ shortid: cp.shortid, game_slug: gameSlug })
            .then(setGlobalStats);
    }, [cp?.shortid, gameSlug]);

    // Graph dimensions
    const chartWidth = 760;
    const chartHeight = 280;
    const paddingLeft = 68;
    const paddingRight = 16;
    const paddingTop = 16;
    const paddingBottom = 48;
    const innerWidth = chartWidth - paddingLeft - paddingRight;
    const innerHeight = chartHeight - paddingTop - paddingBottom;

    const minValue = 0;
    const maxDataValue = statHistory.length > 0 ? Math.max(...statHistory.map((p) => p.value)) : 1;
    // Add 50% headroom above the max so data floats in the centre of the chart
    const maxValue = maxDataValue > 0 ? maxDataValue * 1.5 : 1;
    const valueRange = Math.max(1, maxValue - minValue);

    const allStatDefs: { stat_slug: string; stat_name: string }[] = (game?.stats ?? []) as any;
    const statDefMap = Object.fromEntries(allStatDefs.map((s) => [s.stat_slug, s]));

    const fmtY = (v: number) => v >= 10000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v));
    const fmtStatVal = (row: GlobalStatRow) =>
        row.valueINT != null ? fmtY(row.valueINT) : row.valueFLOAT != null ? fmtY(row.valueFLOAT) : "\u2014";
    const fmtStatBest = (row: GlobalStatRow) =>
        row.bestINT != null ? fmtY(row.bestINT) : row.bestFLOAT != null ? fmtY(row.bestFLOAT) : "\u2014";

    // Compute "nice" Y ticks so values are never duplicated
    const rawStep = valueRange / 4;
    const pow10 = rawStep > 0 ? Math.pow(10, Math.floor(Math.log10(rawStep))) : 1;
    const niceStep = rawStep >= 5 * pow10 ? 5 * pow10 : rawStep >= 2 * pow10 ? 2 * pow10 : pow10 === 0 ? 1 : pow10;
    const ySteps: { value: number; y: number }[] = [];
    for (let v = minValue; v <= maxValue + niceStep * 0.01; v += niceStep) {
        const rounded = Math.round(v / niceStep) * niceStep;
        if (rounded > maxValue + niceStep * 0.5) break;
        const t = valueRange === 0 ? 0 : (rounded - minValue) / valueRange;
        ySteps.push({ value: rounded, y: paddingTop + (1 - t) * innerHeight });
    }
    // Always include max as a tick if it isn't already close to the last one
    const lastTick = ySteps[ySteps.length - 1]?.value ?? 0;
    if (maxValue > 0 && maxValue - lastTick > niceStep * 0.4) {
        ySteps.push({ value: maxValue, y: paddingTop });
    }

    const maxXLabels = 7;
    const xLabelIndices = new Set<number>(
        statHistory.length <= maxXLabels
            ? statHistory.map((_, i) => i)
            : Array.from({ length: maxXLabels }, (_, i) => Math.round((i / (maxXLabels - 1)) * (statHistory.length - 1)))
    );

    const fmtDate = (ts: string) => {
        const d = new Date(ts);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    const points = statHistory.map((point, idx) => {
        const x = paddingLeft + (idx / Math.max(1, statHistory.length - 1)) * innerWidth;
        const y = paddingTop + (1 - (point.value - minValue) / valueRange) * innerHeight;
        return { ...point, x, y };
    });
    const chartPathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
    const areaPathD = points.length > 0
        ? `${chartPathD} L${(paddingLeft + innerWidth).toFixed(2)} ${(paddingTop + innerHeight).toFixed(2)} L${paddingLeft.toFixed(2)} ${(paddingTop + innerHeight).toFixed(2)} Z`
        : "";
    const latestValue = statHistory[statHistory.length - 1]?.value ?? 0;
    const previousValue = statHistory[statHistory.length - 2]?.value ?? latestValue;
    const valueDelta = latestValue - previousValue;

    const highestValue = statHistory.length > 0 ? Math.max(...statHistory.map((p) => p.value)) : 0;
    const lowestValue = statHistory.length > 0 ? Math.min(...statHistory.map((p) => p.value)) : 0;
    let biggestDrop = 0;
    let biggestIncrease = 0;
    for (let i = 1; i < statHistory.length; i++) {
        const diff = statHistory[i].value - statHistory[i - 1].value;
        if (diff > biggestIncrease) biggestIncrease = diff;
        if (diff < biggestDrop) biggestDrop = diff;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md order-last sm:col-span-2">
                <div className="absolute inset-x-0 top-0 h-px" />
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Stat History</p>
                        <p className="text-sm font-semibold text-slate-800">Past 30 Days</p>
                        {statsOptions.find((s) => s.stat_slug === selectedStat) && (
                            <p className="mt-0.5 text-xs text-blue-600 font-semibold">{statsOptions.find((s) => s.stat_slug === selectedStat)!.stat_name}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">View Stat</label>
                        <select
                            value={selectedStat}
                            onChange={(e) => setSelectedStat(e.target.value)}
                            className="h-10 rounded-lg border-2 border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        >
                            <option value="" disabled>Choose a Stat</option>
                            {statsOptions.map((s) => (
                                <option key={s.stat_slug} value={s.stat_slug}>{s.stat_name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1.5">
                            {selectedStat ? (
                                <>
                                    Current: <span className="font-bold text-slate-900">{latestValue}</span>{" "}
                                    <span className={`text-[11px] font-semibold ${valueDelta >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                        {valueDelta >= 0 ? "+" : ""}{valueDelta} last
                                    </span>
                                </>
                            ) : (
                                <span className="text-slate-400">Pick a stat to view history</span>
                            )}
                        </p>
                    </div>
                </div>
                {/* Summary row */}
                {statHistory.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 rounded-lg border border-slate-100 bg-slate-50 text-center">
                        {[
                            { label: "Current", value: latestValue, color: "text-blue-600" },
                            { label: "Best", value: highestValue, color: "text-emerald-600" },
                            { label: "Worst", value: lowestValue, color: "text-rose-500" },
                            { label: "Up", value: biggestIncrease, color: "text-emerald-600", prefix: "+" },
                            { label: "Down", value: biggestDrop, color: biggestDrop < 0 ? "text-rose-500" : "text-slate-400" },
                            { label: "Matches", value: statHistory.length, color: "text-slate-600" },
                        ].map(({ label, value, color, prefix }) => (
                            <div key={label} className="py-2 px-1">
                                <p className={`mt-0.5 text-md font-black ${color}`}>{prefix ?? ""}{fmtY(value)}</p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                    {!selectedStat ? (
                        <div className="flex h-52 sm:h-60 items-center justify-center">
                            <p className="text-sm font-semibold text-slate-400">Select a stat above to view its history</p>
                        </div>
                    ) : (
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-135 h-52 sm:h-60">
                            <defs>
                                <linearGradient id="career-stat-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(59 130 246 / 0.28)" />
                                    <stop offset="100%" stopColor="rgb(14 165 233 / 0.04)" />
                                </linearGradient>
                            </defs>

                            {/* Y axis grid lines + labels */}
                            {ySteps.map(({ value, y }) => (
                                <g key={y}>
                                    <line x1={paddingLeft} x2={paddingLeft + innerWidth} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                                    <text x={paddingLeft - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#94a3b8">{fmtY(value)}</text>
                                </g>
                            ))}

                            {/* Y axis line */}
                            <line x1={paddingLeft} x2={paddingLeft} y1={paddingTop} y2={paddingTop + innerHeight} stroke="#cbd5e1" strokeWidth="1.5" />

                            {/* Y axis title */}
                            <text
                                x={0}
                                y={0}
                                transform={`rotate(-90) translate(${-(paddingTop + innerHeight / 2)}, 12)`}
                                textAnchor="middle"
                                fontSize="16"
                                fontWeight="600"
                                fill="#64748b"
                            >
                                {statsOptions.find((s) => s.stat_slug === selectedStat)?.stat_name ?? selectedStat}
                            </text>

                            {/* X axis line */}
                            <line x1={paddingLeft} x2={paddingLeft + innerWidth} y1={paddingTop + innerHeight} y2={paddingTop + innerHeight} stroke="#cbd5e1" strokeWidth="1.5" />

                            {/* X axis title */}
                            <text
                                x={paddingLeft + innerWidth / 2}
                                y={paddingTop + innerHeight + 38}
                                textAnchor="middle"
                                fontSize="16"
                                fontWeight="600"
                                fill="#64748b"
                            ></text>

                            {/* X axis labels */}
                            {points.map((point, idx) =>
                                xLabelIndices.has(idx) ? (
                                    <g key={idx}>
                                        <line x1={point.x} x2={point.x} y1={paddingTop + innerHeight} y2={paddingTop + innerHeight + 4} stroke="#cbd5e1" strokeWidth="1" />
                                        <text x={point.x} y={paddingTop + innerHeight + 14} textAnchor="middle" fontSize="10" fill="#94a3b8">{fmtDate(point.tsinsert)}</text>
                                    </g>
                                ) : null
                            )}

                            {/* Area + line */}
                            {areaPathD && <path d={areaPathD} fill="url(#career-stat-fill)" />}
                            {chartPathD && <path d={chartPathD} fill="none" stroke="rgb(37 99 235)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                            {/* Data points */}
                            {points.filter((_, idx) => idx % 4 === 0 || idx === points.length - 1).map((point, idx) => (
                                <circle
                                    key={idx}
                                    cx={point.x} cy={point.y} r="5"
                                    fill="rgb(37 99 235)"
                                    stroke="white" strokeWidth="1.5"
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={() => setTooltip({ x: point.x, y: point.y, value: point.value, tsinsert: point.tsinsert })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            ))}

                            {/* Tooltip */}
                            {tooltip && (() => {
                                const tipW = 110;
                                const tipH = 38;
                                const tipX = Math.min(tooltip.x - tipW / 2, chartWidth - tipW - 4);
                                const tipY = tooltip.y - tipH - 10 < paddingTop ? tooltip.y + 10 : tooltip.y - tipH - 10;
                                const dateStr = new Date(tooltip.tsinsert).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                                return (
                                    <g style={{ pointerEvents: "none" }}>
                                        <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="6" fill="#1e293b" opacity="0.93" />
                                        <text x={tipX + tipW / 2} y={tipY + 13} textAnchor="middle" fontSize="10" fill="#94a3b8">{dateStr}</text>
                                        <text x={tipX + tipW / 2} y={tipY + 28} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#f1f5f9">{tooltip.value}</text>
                                    </g>
                                );
                            })()}
                        </svg>
                    )}
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md">
                <div className="absolute inset-x-0 top-0 h-px" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Career Level</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{cp?.level ?? "—"}</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md">
                <div className="absolute inset-x-0 top-0 h-px" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Current Rank</p>
                <PlayerRankLetter gameSlug={gameSlug} className="block mt-1 text-3xl font-black text-slate-900" />
                {rating > 0 && <p className="text-[11px] text-slate-400 font-semibold">{rating.toLocaleString()} rating</p>}
            </div>
            {cp?.xp != null && cp?.maxXp != null ? (
                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md sm:col-span-2">
                    <div className="absolute inset-x-0 top-0 h-px" />
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">XP Progress</p>
                        <p className="text-xs font-bold text-blue-600">{Math.round((cp.xp / cp.maxXp) * 100)}%</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-linear-to-r from-blue-500 to-cyan-400" style={{ width: `${Math.round((cp.xp / cp.maxXp) * 100)}%` }} />
                    </div>
                </div>
            ) : null}

            {globalStats.length > 0 && (() => {
                // Group rows by season, latest season first
                const seasons = [...new Set(globalStats.map((r) => r.season))].sort((a, b) => b - a);
                return (
                    <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md sm:col-span-2">
                        <div className="absolute inset-x-0 top-0 h-px" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3">Global Stats</p>
                        <div className="space-y-4">
                            {seasons.map((season) => {
                                const rows = globalStats.filter((r) => r.season === season);
                                return (
                                    <div key={season}>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Season {season}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                            {rows.map((row) => {
                                                const name = statDefMap[row.stat_slug]?.stat_name ?? ACOS_DISPLAY_NAMES[row.stat_slug] ?? row.stat_slug;
                                                const val = fmtStatVal(row);
                                                const best = fmtStatBest(row);
                                                return (
                                                    <div key={row.stat_slug} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                                                        <p className="text-[10px] font-semibold text-slate-500 truncate">{name}</p>
                                                        <p className="mt-1 text-xl font-black text-slate-900">{val}</p>
                                                        {best !== "\u2014" && best !== val && (
                                                            <p className="text-[10px] text-emerald-600 font-semibold">Best: {best}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
