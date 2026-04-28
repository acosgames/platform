import { useEffect, useState } from "react";
import type React from "react";
import { ForwardIcon, HeartIcon, PlayIcon, BackwardIcon, TrophyIcon, ChartBarIcon, DocumentTextIcon, StarIcon, FilmIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router";
import { currentPlayer, leaderboard } from "../data/mockData";
import { type MatchType } from "../components/ScoreboardPane";
import { DivisionLeaderboardTab } from "../components/gameDetail/DivisionLeaderboardTab";
import { LeaderboardSubtabNav } from "../components/gameDetail/LeaderboardSubtabNav";
import { RankLeaderboardTab } from "../components/gameDetail/RankLeaderboardTab";
import { StatsLeaderboardTab } from "../components/gameDetail/StatsLeaderboardTab";
import { LiveMatchSection } from "../components/gameDetail/LiveMatchSection";
import type { LeaderboardSubtab, SeasonKey, StatsMetric, TimeWindow } from "../components/gameDetail/leaderboardTypes";

import { PlayNow } from "@/components/ui/PlayNow";
import { Panel } from "@/components/ui/Panel";
import { btGame } from "@/actions/buckets";
import { useLoading } from "@/actions/loading";
import { findGame } from "@/actions/game";
import config from "../config";

type DetailTab = "watch-replay" | "leaderboards" | "career-stats" | "game-description" | "tournaments";

export function GameDetail() {
    const { id } = useParams<{ id: string }>();
    
    const [activeTab, setActiveTab] = useState<DetailTab>("leaderboards");
    const [activeLeaderboardSubtab, setActiveLeaderboardSubtab] = useState<LeaderboardSubtab>("division");
    const [divisionSeasonFilter, setDivisionSeasonFilter] = useState<SeasonKey>("s12");
    const [rankCountryFilter, setRankCountryFilter] = useState("all");
    const [rankSeasonFilter, setRankSeasonFilter] = useState<TimeWindow>("season");
    const [statsCountryFilter, setStatsCountryFilter] = useState("all");
    const [statsMetricFilter, setStatsMetricFilter] = useState<StatsMetric>("score");
    const [statsWindowFilter, setStatsWindowFilter] = useState<TimeWindow>("season");
    const [replayFeed, setReplayFeed] = useState<"mine" | "latest">("mine");
    const [activeReplayIndex, setActiveReplayIndex] = useState(0);
    const [isHearted, setIsHearted] = useState(false);
    const [heartReactionCount, setHeartReactionCount] = useState(0);
    
    const game:GameInfoFull = useLoading('game/' + (id ?? ""), btGame);
   
    const heartReactions = 0;// Math.round(game.players * (7.5 + game.rating) + gameSeed * 230);

    useEffect(() => {
        findGame(id ?? "");
      }, []);
      
    useEffect(() => {
        setIsHearted(false);
        setHeartReactionCount(heartReactions);
    }, [heartReactions, game?.game_slug]);

    useEffect(() => {
        setActiveReplayIndex(0);
    }, [replayFeed, game?.game_slug]);


    if (!game) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Game not found</h2>
                <Link
                    to="/"
                    className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500"
                >
                    Back to Games
                </Link>
            </div>
        );
    }

    let imgUrl = `${config.https.cdn}g/${game.game_slug}/preview/${game.preview_images}`;

    const gameSeed = Number(Date.now());
    const avgGameTimeMinutes = 14 * 3;
    
    const topPlayer = leaderboard[gameSeed % leaderboard.length]?.player ?? leaderboard[0]?.player ?? "Unknown";
    const liveMatchType: MatchType = gameSeed % 3 === 0 ? "team-based" : gameSeed % 3 === 1 ? "1v1" : "free-for-all";
    const liveMatch = gameSeed % 2 === 0
        ? {
            title: `${topPlayer} vs ${leaderboard[(gameSeed + 2) % leaderboard.length]?.player ?? "RivalAce"}`,
            viewers: 420 + gameSeed * 83,
            mode: liveMatchType === "team-based" ? "Team Ranked" : liveMatchType === "1v1" ? "Duel" : "Free for All",
            elapsed: `${6 + gameSeed}m`,
        }
        : null;
    const heroWins = 18 + (gameSeed % 17) + currentPlayer.level;
    const heroLosses = Math.max(8, Math.round(heroWins * 0.42));
    const heroPoints = heroWins * 23 + currentPlayer.level * 17;
    const heroFacts = [
        { label: "Games Played", value: `${78 + (gameSeed % 12)}` },
        { label: "Total Time", value: `${71 + (gameSeed % 15)}` },
        { label: "Players Online", value: `${74 + (gameSeed % 14)}` },
        { label: "Release", value: game.tsinsert.split(' ')[0] },
        { label: "Avg Time", value: `${avgGameTimeMinutes} MIN` },
        { label: "Region", value: leaderboard[gameSeed % leaderboard.length]?.country.toUpperCase() ?? "GLOBAL" },
    ];

    const myReplays = [
        {
            id: `${game.game_slug}-mine-1`,
            title: `${currentPlayer.name} vs ${topPlayer}`,
            featuredBy: "Ranked Duel",
            duration: "14m 12s",
            mode: liveMatchType === "team-based" ? "Team Review" : liveMatchType === "1v1" ? "Duel Replay" : "FFA Replay",
            viewers: 184,
            elapsed: "03:21",
        },
        {
            id: `${game.game_slug}-mine-2`,
            title: `${currentPlayer.name} Clutch Finish`,
            featuredBy: "Placement Run",
            duration: "9m 48s",
            mode: liveMatchType === "team-based" ? "Squad Replay" : liveMatchType === "1v1" ? "Ranked Duel" : "Free For All",
            viewers: 96,
            elapsed: "07:42",
        },
        {
            id: `${game.game_slug}-mine-3`,
            title: `${currentPlayer.name} Comeback Map`,
            featuredBy: "Season Highlight",
            duration: "18m 05s",
            mode: liveMatchType === "team-based" ? "Championship Scrim" : liveMatchType === "1v1" ? "Best of One" : "Arena Run",
            viewers: 143,
            elapsed: "11:05",
        },
    ];

    const latestReplays = [
        {
            id: `${game.game_slug}-latest-1`,
            title: `${topPlayer} Tournament Finals`,
            featuredBy: "Latest Upload",
            duration: "22m 11s",
            mode: liveMatchType === "team-based" ? "Grand Finals" : liveMatchType === "1v1" ? "Final Duel" : "Arena Showcase",
            viewers: 824,
            elapsed: "05:14",
        },
        {
            id: `${game.game_slug}-latest-2`,
            title: `${leaderboard[(gameSeed + 3) % leaderboard.length]?.player ?? "NightFox"} Highlight Reel`,
            featuredBy: "Community Pick",
            duration: "11m 27s",
            mode: liveMatchType === "team-based" ? "Ranked Squad" : liveMatchType === "1v1" ? "Top Ladder" : "Chaos Queue",
            viewers: 537,
            elapsed: "08:52",
        },
        {
            id: `${game.game_slug}-latest-3`,
            title: `${leaderboard[(gameSeed + 5) % leaderboard.length]?.player ?? "AcePilot"} Perfect Run`,
            featuredBy: "Latest Upload",
            duration: "16m 39s",
            mode: liveMatchType === "team-based" ? "Team Ranked" : liveMatchType === "1v1" ? "Duel Replay" : "Battle Mix",
            viewers: 691,
            elapsed: "02:48",
        },
    ];

    const replayEntries = replayFeed === "mine" ? myReplays : latestReplays;
    const activeReplay = replayEntries[Math.min(activeReplayIndex, replayEntries.length - 1)] ?? replayEntries[0];




    const handleHeartToggle = () => {
        setIsHearted((prev) => {
            const next = !prev;
            setHeartReactionCount((count) => Math.max(0, count + (next ? 1 : -1)));
            return next;
        });
    };

    const formatReactionCount = (count: number) => {
        if (count < 1000) return count.toString();
        return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count);
    };

    const tabs: Array<{ key: DetailTab; label: string; icon: React.ElementType }> = [
        { key: "leaderboards", label: "Leaderboards", icon: TrophyIcon },
        { key: "career-stats", label: "Career Stats", icon: ChartBarIcon },
        { key: "game-description", label: "Description", icon: DocumentTextIcon },
        { key: "tournaments", label: "Tournaments", icon: StarIcon },
        { key: "watch-replay", label: "Replays", icon: FilmIcon },
    ];

    const getRecord = (wins: number, idx: number) => {
        const ties = Math.max(4, Math.round(wins * 0.08) - idx);
        const losses = Math.max(10, Math.round(wins * 0.34) + idx * 3);
        return { ties, losses };
    };

    const leaderboardCountries = Array.from(new Set(leaderboard.map((entry) => entry.country.toUpperCase()))).sort();

    const filteredRankEntries = leaderboard.filter((entry) => {
        if (rankCountryFilter === "all") return true;
        return entry.country.toUpperCase() === rankCountryFilter;
    });

    const filteredStatsEntries = leaderboard.filter((entry) => {
        if (statsCountryFilter === "all") return true;
        return entry.country.toUpperCase() === statsCountryFilter;
    });

    const getWindowScale = (window: TimeWindow) => {
        if (window === "weekly") return 0.14;
        if (window === "monthly") return 0.46;
        return 1;
    };

    const getStatsValue = (entry: (typeof leaderboard)[number], idx: number) => {
        const scale = getWindowScale(statsWindowFilter);
        const { ties, losses } = getRecord(entry.wins, idx);
        const totalGames = entry.wins + ties + losses;
        const winRate = totalGames > 0 ? (entry.wins / totalGames) * 100 : 0;

        if (statsMetricFilter === "wins") return Math.round(entry.wins * scale).toLocaleString();
        if (statsMetricFilter === "win-rate") return `${Math.round(winRate)}%`;
        return Math.round(entry.score * scale).toLocaleString();
    };

    const seasonOptions: Array<{ key: SeasonKey; label: string }> = [
        { key: "s12", label: "Season 12" },
        { key: "s11", label: "Season 11" },
        { key: "s10", label: "Season 10" },
    ];

    const ratingHistory = Array.from({ length: 26 }, (_, idx) => {
        const startRating = 980 + gameSeed * 1;
        const trend = idx * (8 + (gameSeed % 3));
        const volatility = Math.round(Math.sin((idx + 1) * (0.72 + gameSeed * 0.03)) * 42);
        const microSwing = ((idx % 5) - 2) * 6;
        const rating = startRating + trend + volatility + microSwing;
        return { match: idx + 1, rating };
    });

    const minRating = Math.min(...ratingHistory.map((point) => point.rating));
    const maxRating = Math.max(...ratingHistory.map((point) => point.rating));
    const ratingRange = Math.max(1, maxRating - minRating);
    const chartWidth = 760;
    const chartHeight = 250;
    const chartPaddingX = 24;
    const chartPaddingY = 18;
    const innerWidth = chartWidth - chartPaddingX * 2;
    const innerHeight = chartHeight - chartPaddingY * 2;

    const ratingPoints = ratingHistory.map((point, idx) => {
        const x = chartPaddingX + (idx / Math.max(1, ratingHistory.length - 1)) * innerWidth;
        const y = chartPaddingY + (1 - (point.rating - minRating) / ratingRange) * innerHeight;
        return { ...point, x, y };
    });

    const chartPathD = ratingPoints
        .map((point, idx) => `${idx === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(" ");

    const areaPathD = `${chartPathD} L${(chartWidth - chartPaddingX).toFixed(2)} ${(chartHeight - chartPaddingY).toFixed(2)} L${chartPaddingX.toFixed(2)} ${(chartHeight - chartPaddingY).toFixed(2)} Z`;
    const latestRating = ratingHistory[ratingHistory.length - 1]?.rating ?? 0;
    const previousRating = ratingHistory[ratingHistory.length - 2]?.rating ?? latestRating;
    const ratingDelta = latestRating - previousRating;

    const hashString = (value: string) => {
        let hash = 2166136261;
        for (let i = 0; i < value.length; i += 1) {
            hash ^= value.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return Math.abs(hash >>> 0);
    };

    const divisionBaseNames = ["Nova", "Vanguard", "Apex", "Titan", "Pulse", "Summit"];

    const divisionAssignments = [...leaderboard]
        .map((entry, idx) => ({
            ...entry,
            randomKey: hashString(`${divisionSeasonFilter}-${entry.player}-${idx}`),
        }))
        .sort((a, b) => a.randomKey - b.randomKey)
        .map((entry, idx) => {
            const divisionIndex = Math.floor(idx / 30);
            const cycle = Math.floor(divisionIndex / divisionBaseNames.length);
            const baseName = divisionBaseNames[divisionIndex % divisionBaseNames.length];
            const divisionName = cycle === 0 ? baseName : `${baseName} ${cycle + 1}`;

            return {
                ...entry,
                divisionName,
            };
        });

    const divisionGroups = divisionAssignments.reduce<Record<string, (typeof leaderboard)[number][]>>((acc, entry) => {
        if (!acc[entry.divisionName]) {
            acc[entry.divisionName] = [];
        }
        acc[entry.divisionName].push(entry);
        return acc;
    }, {});

    const renderTabPanel = () => {
        if (activeTab === "watch-replay") {
            return (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/12 bg-black/30 px-3 py-2.5 backdrop-blur-sm">
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">Replay Controls</p>
                                <p className="text-sm font-semibold text-white truncate">{activeReplay.featuredBy}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveReplayIndex((index) => Math.max(0, index - 1))}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 text-xs font-semibold text-white/85 transition-colors hover:border-primary/40 hover:text-white"
                                >
                                    <BackwardIcon className="h-4 w-4" />
                                    Rewind
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveReplayIndex((index) => Math.min(replayEntries.length - 1, index + 1))}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 text-xs font-semibold text-white/85 transition-colors hover:border-primary/40 hover:text-white"
                                >
                                    Fast Forward
                                    <ForwardIcon className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveReplayIndex((index) => (index + 1) % replayEntries.length)}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/18 px-3 text-xs font-semibold text-white transition-colors hover:bg-primary/28"
                                >
                                    <PlayIcon className="h-4 w-4" />
                                    Next Replay
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-wrap items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setReplayFeed("latest")}
                                className={`h-9 px-4 rounded-full border text-xs font-semibold transition-colors ${replayFeed === "latest"
                                    ? "border-primary/45 bg-primary/18 text-white"
                                    : "border-white/15 bg-black/20 text-white/75 hover:border-primary/35 hover:text-white"
                                    }`}
                            >
                                Latest Replays
                            </button>
                            <button
                                type="button"
                                onClick={() => setReplayFeed("mine")}
                                className={`h-9 px-4 rounded-full border text-xs font-semibold transition-colors ${replayFeed === "mine"
                                    ? "border-primary/45 bg-primary/18 text-white"
                                    : "border-white/15 bg-black/20 text-white/75 hover:border-primary/35 hover:text-white"
                                    }`}
                            >
                                My Replays
                            </button>

                        </div>

                    </div>

                    {activeReplay ? (
                        <LiveMatchSection
                            gameName={game.name}
                            gameImageUrl={imgUrl}
                            liveMatch={{
                                title: activeReplay.title,
                                viewers: activeReplay.viewers,
                                mode: activeReplay.mode,
                                elapsed: activeReplay.elapsed,
                            }}
                            liveMatchType={liveMatchType}
                            mode="replay"
                            // paneTitle="Replay Breakdown"
                            description={`Featured in ${activeReplay.featuredBy} • ${activeReplay.duration} total runtime.`}
                        //   actionBar={

                        //   }
                        />
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {replayEntries.map((replay, index) => (
                            <button
                                key={replay.id}
                                type="button"
                                onClick={() => setActiveReplayIndex(index)}
                                className={`rounded-md border px-3.5 py-3 text-left transition-all ${index === activeReplayIndex
                                    ? "border-primary/40 bg-primary/14 shadow-[0_0_18px_rgba(91,141,255,0.18)]"
                                    : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/28"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-foreground truncate">{replay.title}</p>
                                    <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-semibold text-white/70">
                                        {replay.elapsed}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground truncate">{replay.featuredBy} • {replay.duration}</p>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTab === "leaderboards") {
            return (
                <div className="space-y-3">
                    <LeaderboardSubtabNav activeSubtab={activeLeaderboardSubtab} onChange={setActiveLeaderboardSubtab} />

                    {activeLeaderboardSubtab === "division" ? (
                        <DivisionLeaderboardTab
                            divisionSeasonFilter={divisionSeasonFilter}
                            seasonOptions={seasonOptions}
                            divisionGroups={divisionGroups}
                            onDivisionSeasonChange={setDivisionSeasonFilter}
                        />
                    ) : null}

                    {activeLeaderboardSubtab === "rank" ? (
                        <RankLeaderboardTab
                            rankCountryFilter={rankCountryFilter}
                            rankSeasonFilter={rankSeasonFilter}
                            leaderboardCountries={leaderboardCountries}
                            filteredRankEntries={filteredRankEntries}
                            onRankCountryChange={setRankCountryFilter}
                            onRankSeasonChange={setRankSeasonFilter}
                        />
                    ) : null}

                    {activeLeaderboardSubtab === "stats" ? (
                        <StatsLeaderboardTab
                            statsCountryFilter={statsCountryFilter}
                            statsMetricFilter={statsMetricFilter}
                            statsWindowFilter={statsWindowFilter}
                            leaderboardCountries={leaderboardCountries}
                            filteredStatsEntries={filteredStatsEntries}
                            getStatsValue={getStatsValue}
                            onStatsCountryChange={setStatsCountryFilter}
                            onStatsMetricChange={setStatsMetricFilter}
                            onStatsWindowChange={setStatsWindowFilter}
                        />
                    ) : null}
                </div>
            );
        }

        if (activeTab === "career-stats") {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative rounded-md overflow-hidden border border-primary/20 bg-card/90 p-3.5 sm:col-span-2">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/70 via-secondary/40 to-transparent" />
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Rating History</p>
                                <p className="text-sm font-semibold text-foreground">Per Match Progression</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Current</p>
                                <p className="text-base font-bold text-primary">{latestRating.toLocaleString()}</p>
                                <p className={`text-[11px] font-semibold ${ratingDelta >= 0 ? "text-emerald-400" : "text-secondary"}`}>
                                    {ratingDelta >= 0 ? "+" : ""}{ratingDelta} last match
                                </p>
                            </div>
                        </div>

                        <div className="rounded-md bg-black/30 border border-primary/18 p-2 overflow-x-auto">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-135 h-48 sm:h-56">
                                <defs>
                                    <linearGradient id="career-rating-fill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgb(47 109 246 / 0.55)" />
                                        <stop offset="100%" stopColor="rgb(240 59 91 / 0.06)" />
                                    </linearGradient>
                                </defs>

                                {[0, 0.25, 0.5, 0.75, 1].map((step) => {
                                    const y = chartPaddingY + innerHeight * step;
                                    return (
                                        <line
                                            key={step}
                                            x1={chartPaddingX}
                                            y1={y}
                                            x2={chartWidth - chartPaddingX}
                                            y2={y}
                                            stroke="rgb(255 255 255 / 0.08)"
                                            strokeDasharray="4 6"
                                        />
                                    );
                                })}

                                <path d={areaPathD} fill="url(#career-rating-fill)" />
                                <path d={chartPathD} fill="none" stroke="rgb(91 141 255)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                                {ratingPoints.filter((_, idx) => idx % 4 === 0 || idx === ratingPoints.length - 1).map((point) => (
                                    <circle key={point.match} cx={point.x} cy={point.y} r="3.5" fill="rgb(91 141 255)" />
                                ))}
                            </svg>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Match 1</span>
                            <span>Match {ratingHistory.length}</span>
                        </div>
                    </div>

                    <div className="relative rounded-md overflow-hidden border border-primary/20 bg-black/30 p-3.5">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/80 to-transparent" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Career Level</p>
                        <p className="mt-1 text-2xl font-black text-white">{currentPlayer.level}</p>
                    </div>
                    <div className="relative rounded-md overflow-hidden border border-secondary/20 bg-black/30 p-3.5">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-secondary/80 to-transparent" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Current Rank</p>
                        <p className="mt-1 text-2xl font-black text-white">{currentPlayer.rank}</p>
                    </div>
                    <div className="relative rounded-md overflow-hidden border border-white/10 bg-black/30 p-3.5 sm:col-span-2">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/60 via-secondary/50 to-transparent" />
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">XP Progress</p>
                            <p className="text-xs font-bold text-primary">{Math.round((currentPlayer.xp / currentPlayer.maxXp) * 100)}%</p>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-linear-to-r from-primary to-secondary" style={{ width: `${Math.round((currentPlayer.xp / currentPlayer.maxXp) * 100)}%` }} />
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === "game-description") {
            return (
                <div className="relative rounded-md overflow-hidden border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-px " />
                    <div className="text-sm leading-relaxed text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-100 [&_pre]:p-3 [&_ul]:list-disc [&_ul]:space-y-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {game.longdesc ?? ""}
                        </ReactMarkdown>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                    { name: "Weekend Clash", time: "Sat 6:00 PM", prize: "$2,500" },
                    { name: "Open Ladder Cup", time: "Sun 4:00 PM", prize: "$5,000" },
                ].map((t) => (
                    <div key={t.name} className="relative rounded-md overflow-hidden border border-white/10 bg-black/30 p-4 space-y-2">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary via-secondary/70 to-transparent" />
                        <p className="text-sm font-black uppercase tracking-wide text-white">{t.name}</p>
                        <p className="text-xs text-white/50 font-medium">{t.time}</p>
                        <p className="text-base font-black text-secondary">{t.prize} <span className="text-xs font-medium text-white/40">Prize Pool</span></p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4 py-8">
            <div className="mb-5 flex items-start justify-between gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900/85 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-slate-900"
                        >
                            ← Back to Games
                        </Link>

                        
                    </div>
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[20px] bg-emerald-400 text-slate-900 shadow-[0_18px_42px_rgba(15,23,42,0.12)]">
                {/* <div className="absolute inset-0 bg-linear-to-br from-white via-slate-50 to-slate-100/90" /> */}
                <div className="absolute inset-0 opacity-30 bg-[repeating-radial-gradient(circle_at_12%_20%,rgba(148,163,184,0.95)_0_2px,transparent_2px_22px)]" />
                {/* <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_65%_45%,rgba(255,255,255,0.96),transparent_65%)]" /> */}

                <div className="relative px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[auto_minmax(0,1fr)_14rem] xl:items-start xl:gap-5">
                        <div className="relative mx-auto w-36 sm:mx-0 sm:w-40 lg:w-56">
                            <div className="absolute inset-x-8 bottom-0 h-5 rounded-full bg-slate-900/30 blur-xl" />
                            <img
                                src={imgUrl}
                                alt={game.name}
                                className="relative h-36 w-full rounded-xl bg-white border-6 border-white object-cover object-center sm:h-40 lg:h-56"
                            />
                        </div>

                        <div className="relative z-10 min-w-0 text-center sm:text-left md:pb-18">
                            <h1 className="truncate text-[1.7rem] font-black uppercase tracking-tight text-slate-900 sm:text-[2.2rem] lg:text-[2.25rem]">
                                {game.name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <p className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                                    {game.displayname} • Level {currentPlayer.level}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleHeartToggle}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${isHearted
                                        ? "border-rose-400 bg-rose-100 text-rose-800 shadow-[0_0_16px_rgba(244,63,94,0.22)]"
                                        : "border-slate-300 bg-white/80 text-slate-700 hover:border-rose-300"
                                        }`}
                                    aria-pressed={isHearted}
                                    aria-label={isHearted ? "Remove heart reaction" : "Add heart reaction"}
                                >
                                    <HeartIcon className={`h-3.5 w-3.5 text-rose-500 ${isHearted ? "animate-pulse" : ""}`} />
                                    <span>{formatReactionCount(heartReactionCount)}</span>
                                </button>
                            </div>
                            {game.shortdesc ? (
                                <blockquote className="mx-auto mt-3 max-w-lg rounded-lg  bg-slate-300/5 px-4 py-2 text-sm italic leading-relaxed text-slate-600 sm:mx-0">
                                    {/* <span className="mr-1 align-top text-base font-semibold leading-none text-slate-400">"</span> */}
                                    {game.shortdesc}
                                    {/* <span className="ml-1 align-bottom text-base font-semibold leading-none text-slate-400">"</span> */}
                                </blockquote>
                            ) : null}
                            <div className="mt-4 flex justify-center sm:justify-start md:absolute md:right-0 md:bottom-2 md:mt-0 md:justify-end xl:hidden">
                                <PlayNow game_slug={game.game_slug} name={game.name} />
                            </div>

                        </div>

                        <div className="hidden xl:flex xl:flex-col xl:items-end xl:justify-start">
                            <Panel
                                className="w-56 shrink-0 self-start"
                                header={
                                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                                        Your Season Stats
                                    </p>
                                }
                                footer={
                                    <div className="grid grid-cols-3 divide-x divide-slate-200/90 px-2  py-3 pt-6">
                                        <div className="text-center">
                                            <p className="text-xs font-black text-slate-800">{heroWins}</p>
                                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Wins</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black text-slate-800">{heroLosses}</p>
                                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Losses</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black text-slate-800">{heroPoints}</p>
                                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Points</p>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-1 px-2 py-3">
                                    <div className="text-center">
                                        <p className="text-base font-black text-slate-800">{currentPlayer.rank}</p>
                                        <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Current Rank</p>
                                    </div>
                                </div>
                            </Panel>
                            <div className="mt-4">
                                <PlayNow game_slug={game.game_slug} name={game.name} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
                <Panel
                    className="xl:hidden"
                    header={
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                            Your Season Stats
                        </p>
                    }
                    footer={
                        <div className="grid grid-cols-3 divide-x divide-slate-200/90 px-2 py-3 sm:px-3">
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-800 sm:text-xl">{heroWins}</p>
                                <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">Wins</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-800 sm:text-xl">{heroLosses}</p>
                                <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">Losses</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-800 sm:text-xl">{heroPoints}</p>
                                <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">Points</p>
                            </div>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 px-2 py-3 sm:px-3">
                        <div className="text-center">
                            <p className="text-base font-black text-slate-800 sm:text-lg">{currentPlayer.rank}</p>
                            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">Current Rank</p>
                        </div>
                    </div>
                </Panel>

                <Panel
                    className="xl:col-span-full"
                    header={
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                            Game Statistics
                        </p>
                    }
                >
                    <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 xl:grid-cols-6">
                        {heroFacts.map((fact) => (
                            <div key={fact.label} className="rounded-lg  px-2 py-2 text-center ">
                                <p className="text-xs font-black uppercase tracking-tight text-slate-800 sm:text-sm">{fact.value}</p>
                                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-600 sm:text-[10px]">{fact.label}</p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </section>

            
            {liveMatch ? <LiveMatchSection gameName={game.name} gameImageUrl={imgUrl} liveMatch={liveMatch} liveMatchType={liveMatchType} /> : null}

            {/* <section className="w-full  grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 ">
                {statCards.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </section> */}

            {/* Bottom tabbed detail section */}
            {/* <section className="rounded-md  border-cyan-400/20 bg-card/95 p-4 sm:p-5 space-y-4"> */}
            {/* <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300">
            Game Hub
          </h2>
          <span className="text-[11px] px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">Live Data</span>
        </div> */}

            <div className="w-full overflow-x-auto pb-1">
                <div className="flex w-max min-w-full justify-center">
                    <div className="inline-flex items-center rounded-full bg-white p-1 shadow-md whitespace-nowrap">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-all ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <section>
                {renderTabPanel()}
            </section>


        </div>
    );
}
