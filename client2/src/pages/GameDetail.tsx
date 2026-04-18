import { useEffect, useState } from "react";
import { ForwardIcon, HeartIcon, PlayIcon, BackwardIcon } from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router";
import { currentPlayer, games, leaderboard } from "../data/mockData";
import { type MatchType } from "../components/ScoreboardPane";
import { DivisionLeaderboardTab } from "../components/gameDetail/DivisionLeaderboardTab";
import { LeaderboardSubtabNav } from "../components/gameDetail/LeaderboardSubtabNav";
import { RankLeaderboardTab } from "../components/gameDetail/RankLeaderboardTab";
import { StatsLeaderboardTab } from "../components/gameDetail/StatsLeaderboardTab";
import { LiveMatchSection } from "../components/gameDetail/LiveMatchSection";
import type { LeaderboardSubtab, SeasonKey, StatsMetric, TimeWindow } from "../components/gameDetail/leaderboardTypes";

import { StatCard } from "@/components/ui/StatCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PlayNow } from "@/components/ui/PlayNow";
import { btGame, btGames } from "@/actions/buckets";
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

    const gameSeed = Number(game.game_slug);
    const activePlayers = 0;//
    const totalGamesPlayed = 0;// game.players * (18 + gameSeed * 3);
    const yourGamesPlayed = 80 + currentPlayer.level * 3 + gameSeed * 7;
    const avgGameTimeMinutes = 14 + gameSeed * 3;
    
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
    const statCards = [
        { label: "Games Played (Global)", value: totalGamesPlayed.toLocaleString() },
        { label: "Top Player", value: topPlayer },
        { label: "Games Played (You)", value: yourGamesPlayed.toLocaleString() },
        { label: "Average Game Time", value: `${avgGameTimeMinutes} min` },
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

    const tabs: Array<{ key: DetailTab; label: string }> = [
        { key: "leaderboards", label: "Leaderboards" },
        { key: "career-stats", label: "Career Stats" },
        { key: "game-description", label: "Game Description" },
        { key: "tournaments", label: "Tournaments" },
        { key: "watch-replay", label: "Watch Replays" },
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
        const startRating = 980 + gameSeed * 26;
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
                <div className="relative rounded-md overflow-hidden border border-white/10 bg-black/25 p-4">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/50 via-secondary/30 to-transparent" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {game.longdesc} 
                    </p>
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

            {/* Hero */}
            <section className="relative  ">
                {/* <div className="relative w-full"> */}
                <div className="absolute top-4 left-0 sm:top-5 sm:left-0 z-10 ">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-[0.08em] text-foreground border-0 border-white/15 bg-black/50 hover:bg-black/30 hover:border-primary/40 transition-all duration-200 active:scale-95"
                    >
                        ← Back to Games
                    </Link>
                </div>
                <img
                    src={imgUrl}
                    alt={game.name}
                    className="rounded-lg w-full h-64 sm:h-64 lg:h-64 object-cover brightness-75 saturate-110" />

                {/* <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10" /> */}
                {/* <div className="absolute inset-0 bg-linear-to-r from-primary/25 via-transparent to-secondary/22" /> */}
                {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_100%,rgba(47,109,246,0.2),transparent)]" /> */}

                <div className="absolute top-4 right-5 sm:top-5 sm:right-5 z-10 ">
                    <button
                        type="button"
                        onClick={handleHeartToggle}
                        className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold bg-transparent transition-all duration-200 active:scale-95 ${isHearted
                            ? "border-rose-300/70 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.28)]"
                            : "border-white/30 text-foreground hover:border-rose-300/55"
                            }`}
                        aria-pressed={isHearted}
                        aria-label={isHearted ? "Remove heart reaction" : "Add heart reaction"}
                    >
                        <HeartIcon className={`h-3.5 w-3.5 text-rose-500 ${isHearted ? "animate-pulse" : ""}`} />
                        <span>{formatReactionCount(heartReactionCount)}</span>
                    </button>
                </div>

                <div className="absolute right-5 bottom-4 sm:right-5 sm:bottom-6 z-10 ">
                    <PlayNow game_slug={game.game_slug} name={game.name} />
                </div>

                <div className="absolute left-5 right-5 top-4 sm:left-5 sm:right-5 sm:top-auto sm:bottom-6 ">
                    <div className="flex items-end gap-3 min-w-0 pr-0 sm:pr-44">
                        {/* Foreground game image card */}
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1 rounded-md bg-linear-to-br from-primary/20 to-secondary/20 blur-lg" />
                            <img
                                src={imgUrl}
                                alt={`${game.name} cover`}
                                className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-md object-cover border border-white/20 shadow-xl"
                            />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white leading-tight drop-shadow-[0_2px_16px_rgba(91,141,255,0.55)] truncate">{game.name}</h1>
                            <p className="text-xs sm:text-sm text-white/65 font-semibold truncate">by {game.displayname}</p>
                        </div>
                    </div>
                </div>
                {/* </div> */}

            </section>

            
            <InfoPanel>
                <div className="flex flex-col gap-4">
                    {/* <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-sm border border-primary/40 bg-primary/12 text-white font-bold uppercase tracking-wide">
                            {game.category}
                        </span>
                        {game.genre.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-sm border border-white/12 bg-white/6 text-white/75 font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div> */}
                    <div className="">
                        <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />{activePlayers.toLocaleString()} online</span>
                            <span>Release: {game.tsinsert}</span>
                            <span>Rating: {game.votes.toFixed(1)}</span>
                        </div>

                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                            {game.shortdesc}
                        </p>
                    </div>

                </div>
            </InfoPanel>

            {liveMatch ? <LiveMatchSection gameName={game.name} gameImageUrl={imgUrl} liveMatch={liveMatch} liveMatchType={liveMatchType} /> : null}

            <section className="w-full  grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 ">
                {statCards.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </section>

            {/* Bottom tabbed detail section */}
            {/* <section className="rounded-md  border-cyan-400/20 bg-card/95 p-4 sm:p-5 space-y-4"> */}
            {/* <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300">
            Game Hub
          </h2>
          <span className="text-[11px] px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">Live Data</span>
        </div> */}

            <section className="rounded-md shadow-black/30 shadow-md bg-card">
                <div className="sticky top-12.5 z-20 overflow-y-hidden overflow-x-auto bg-card border-b border-white/10">
                    <div className="px-4 min-w-max flex items-end gap-1 pt-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative px-4 lg:px-6 py-2.5 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all -skew-x-12 border border-b-0 rounded-t-sm ${
                                    activeTab === tab.key
                                        ? "bg-linear-to-b from-red-600 to-red-800 border-red-700/50 text-white shadow-[0_-3px_14px_rgba(220,38,38,0.35)] translate-y-px"
                                        : "bg-black/35 border-white/12 text-white/50 hover:text-white/80 hover:bg-black/55 hover:border-white/20"
                                }`}
                            >
                                <span className="inline-block skew-x-12">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-3.5 sm:p-4">
                    {renderTabPanel()}
                </div>
            </section>


        </div>
    );
}
