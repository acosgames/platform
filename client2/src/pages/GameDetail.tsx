import { useEffect, useState } from "react";
import type React from "react";
import { HeartIcon, PlayIcon, TrophyIcon, ChartBarIcon, DocumentTextIcon, StarIcon, FilmIcon, SparklesIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router";
import { leaderboard } from "../data/mockData";
import { type MatchType } from "../components/ScoreboardPane";
import { DivisionLeaderboardTab } from "../components/gameDetail/DivisionLeaderboardTab";
import { LeaderboardSubtabNav } from "../components/gameDetail/LeaderboardSubtabNav";
import { CareerStatsTab } from "../components/gameDetail/CareerStatsTab";
import { AchievementsTab } from "../components/gameDetail/AchievementsTab";
import { PlayerRankLetter } from "../components/gameDetail/PlayerRankLetter";
import { RankLeaderboardTab } from "../components/gameDetail/RankLeaderboardTab";
import { StatsLeaderboardTab } from "../components/gameDetail/StatsLeaderboardTab";
import { LiveMatchSection } from "../components/gameDetail/LiveMatchSection";
import type { LeaderboardSubtab, LeaderboardSubtabOption, SeasonKey } from "../components/gameDetail/leaderboardTypes";

import { PlayNow } from "@/components/ui/PlayNow";
import { Tooltip } from "@/components/ui/Tooltip";
import { btGame, btLoading, btUser } from "@/actions/buckets";
import { useLoading } from "@/actions/loading";
import { findGame, findGamePerson } from "@/actions/game";
import { WatchReplayTab } from "../components/gameDetail/WatchReplayTab";
import config from "../config";
import { useBucket, useBucketSelector } from "@/actions/bucket";

type DetailTab = "watch-replay" | "leaderboards" | "career-stats" | "game-description" | "tournaments" | "live-match" | "achievements";

export function GameDetail() {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState<DetailTab>("leaderboards");
    const [activeLeaderboardSubtab, setActiveLeaderboardSubtab] = useState<LeaderboardSubtab>("division");

    const [divisionSeasonFilter, setDivisionSeasonFilter] = useState<SeasonKey>("s12");
    // Replay tab state moved to WatchReplayTab
    const [isHearted, setIsHearted] = useState(false);
    const [heartReactionCount, setHeartReactionCount] = useState(0);

    const currentPlayer = useBucket(btUser);
    const game: GameInfoFull = useLoading('game/' + (id ?? ""), btGame);
    const loadingState = useBucketSelector(btLoading, (s: any) => s['game/' + (id ?? '')]);

    // Hide 'division' subtab if not logged in
    const leaderboardSubtabs: LeaderboardSubtabOption[] = currentPlayer ? [
            { key: "division" as const, label: "Division" },
            { key: "rank" as const, label: "Rank" },
            { key: "stats" as const, label: "Stats" },
          ] : [
            { key: "rank" as const, label: "Rank" },
            { key: "stats" as const, label: "Stats" },
          ];

    // If current subtab is 'division' and user logs out, auto-switch to 'rank'
    useEffect(() => {
        if (!currentPlayer && activeLeaderboardSubtab === "division") {
            setActiveLeaderboardSubtab("rank");
        }
    }, [currentPlayer, activeLeaderboardSubtab]);

    const heartReactions = 0;// Math.round(game.players * (7.5 + game.rating) + gameSeed * 230);

    useEffect(() => {
        // Use findGamePerson if user is logged in, otherwise use findGame
        if (currentPlayer && currentPlayer.shortid) {
            findGamePerson(id ?? "");
        } else {
            findGame(id ?? "");
        }
    }, [id, currentPlayer?.shortid]);

    useEffect(() => {
        setIsHearted(false);
        setHeartReactionCount(heartReactions);
    }, [heartReactions, game?.game_slug]);




    if (loadingState !== 2) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-white" />
            </div>
        );
    }

    if (!game?.game_slug) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-lg font-black uppercase tracking-tight text-white">Game not found</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900/85 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-slate-900"
                >
                    ← Back to Games
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
    const heroFacts = [
        { label: "Games Played", value: `${78 + (gameSeed % 12)}` },
        { label: "Total Time", value: `${71 + (gameSeed % 15)}` },
        { label: "Players Online", value: `${74 + (gameSeed % 14)}` },
        { label: "Release", value: game?.tsinsert?.split(' ')[0] },
        { label: "Avg Time", value: `${avgGameTimeMinutes} MIN` },
        { label: "Region", value: (leaderboard[gameSeed % leaderboard.length] as any)?.country?.toUpperCase() ?? "GLOBAL" },
    ];






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
        { key: "achievements", label: "Achievements", icon: SparklesIcon },
        { key: "game-description", label: "Description", icon: DocumentTextIcon },
        { key: "tournaments", label: "Tournaments", icon: StarIcon },
        { key: "watch-replay", label: "Replays", icon: FilmIcon },
        { key: "live-match", label: "Spectate Live", icon: PlayIcon },
    ];

    const seasonOptions: Array<{ key: SeasonKey; label: string }> = [
        { key: "s12", label: "Season 12" },
        { key: "s11", label: "Season 11" },
        { key: "s10", label: "Season 10" },
    ];

    const renderTabPanel = () => {
        if (activeTab === "watch-replay") {
            return <WatchReplayTab gameSlug={game.game_slug} />;
        }

        if (activeTab === "leaderboards") {
            return (
                <div className="space-y-4">
                    <LeaderboardSubtabNav
                        activeSubtab={activeLeaderboardSubtab}
                        onChange={setActiveLeaderboardSubtab}
                        subtabs={leaderboardSubtabs}
                    />

                    {activeLeaderboardSubtab === "division" && currentPlayer ? (
                        <DivisionLeaderboardTab
                            divisionSeasonFilter={divisionSeasonFilter}
                            seasonOptions={seasonOptions}
                            onDivisionSeasonChange={setDivisionSeasonFilter}
                            gameSlug={game.game_slug}
                        />
                    ) : null}

                    {activeLeaderboardSubtab === "rank" ? (
                        <RankLeaderboardTab gameSlug={game.game_slug} />
                    ) : null}

                    {activeLeaderboardSubtab === "stats" ? (
                        <StatsLeaderboardTab gameSlug={game.game_slug} />
                    ) : null}
                </div>
            );
        }

        if (activeTab === "career-stats") {
            return <CareerStatsTab gameSlug={game.game_slug} />;
        }

        if (activeTab === "achievements") {
            return <AchievementsTab />;
        }

        if (activeTab === "game-description") {
            return (
                <div className="relative rounded-md overflow-hidden bg-white p-4 shadow-md">
                    <div className="absolute inset-x-0 top-0 h-px " />
                    <div className="text-sm leading-relaxed text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-100 [&_pre]:p-3 [&_ul]:list-disc [&_ul]:space-y-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {game.longdesc ?? ""}
                        </ReactMarkdown>
                    </div>
                </div>
            );
        }

        if (liveMatch && activeTab == "live-match") {

            if (liveMatch) {
                return <LiveMatchSection gameName={game.name} gameImageUrl={imgUrl} liveMatch={liveMatch} liveMatchType={liveMatchType} mode="live" />;
            }

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
        <div className="space-y-4 pb-4 ">
            {/* <div className="flex items-start justify-between gap-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md  px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-800 transition-colors hover:bg-slate-100"
                >
                    ← Back to Games
                </Link>


            </div> */}
            {/* Hero */}
            <section className="relative rounded-xl overflow-hidden bg-white  shadow-md border-8 border-white">
                {/* Quarter-circle rank badge */}
                <div className="absolute contain-paint top-0 translate-3d right-0 z-20 w-18 h-18 bg-white overflow-hidden rounded-xl rounded-bl-full">
                    <div className="absolute top-2 right-2 flex flex-col items-center gap-0.5 border-2 border-white" >
                        <PlayerRankLetter gameSlug={game.game_slug} className="text-2xl font-black leading-none text-slate-900" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rank</span>
                    </div>
                </div>
                {/* <div className="absolute inset-0 bg-linear-to-br from-white via-slate-50 to-slate-100/90" /> */}
                {/* <div className="absolute inset-0 opacity-30 bg-[repeating-radial-gradient(circle_at_12%_20%,rgba(148,163,184,0.25)_0_2px,transparent_2px_22px)]" /> */}
                {/* <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_65%_45%,rgba(255,255,255,0.96),transparent_65%)]" /> */}

                <div className="relative px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5 bg-slate-950 text-white rounded-xl">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-5 xl:grid-cols-[auto_minmax(0,1fr)] lg:gap-6">
                        <div className="relative mx-auto w-32 lg:mx-0 lg:w-42 ">
                            <div className="absolute inset-x-8 bottom-0 h-5 rounded-full bg-slate-900/30 blur-xl" />
                            <img
                                src={imgUrl}
                                alt={game.name}
                                className="relative h-32 w-full rounded-xl  object-cover object-center lg:h-42 "
                            />
                        </div>

                        <div className="relative flex flex-col z-10 min-w-0 w-full h-full text-center lg:text-left lg:pb-10">
                            <h1 className="truncate text-[1.5rem] font-black uppercase tracking-tight text-white lg:text-[1.4rem] xl:text-[2rem]">
                                {game.name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                <p className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/15">
                                    Created by <a className="text-blue-100 pl-1">{game.displayname}</a>
                                </p>
                                <button
                                    type="button"
                                    onClick={handleHeartToggle}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold transition-all duration-200 active:scale-95 ${isHearted
                                        ? "border-rose-400 bg-rose-100 text-rose-800 shadow-md"
                                        : "border-white/20 bg-white/8 text-white hover:border-rose-300 hover:bg-white/12"
                                        }`}
                                    aria-pressed={isHearted}
                                    aria-label={isHearted ? "Remove heart reaction" : "Add heart reaction"}
                                >
                                    <HeartIcon className={`h-3.5 w-3.5 text-rose-500 ${isHearted ? "animate-pulse" : ""}`} />
                                    <span>{formatReactionCount(heartReactionCount)}</span>
                                </button>
                            </div>
                            {game.shortdesc ? (
                                <p className="mt-3 inline rounded-lg  px-4 py-2 text-sm italic leading-relaxed text-slate-100 md:mx-0">
                                    {/* <span className="mr-1 align-top text-base font-semibold leading-none text-slate-400">"</span> */}
                                    {game.shortdesc}
                                    {/* <span className="ml-1 align-bottom text-base font-semibold leading-none text-slate-400">"</span> */}
                                </p>
                            ) : null}
                            <div className=" flex-1 flex justify-center mb-4 lg:mb-2 lg:justify-end lg:absolute lg:inset-x-0 bottom-2 lg:mt-0">
                                <PlayNow game_slug={game.game_slug} name={game.name} />
                            </div>

                        </div>


                    </div>
                </div>

                <div className=" relative bg-white">
                    <div className="grid grid-cols-2 gap-2 px-3 py-2 sm:grid-cols-3 xl:grid-cols-6 lg:px-5">
                        {heroFacts.map((fact) => (
                            <div key={fact.label} className="px-2 py-2 text-center">
                                <p className="text-md font-black text-slate-800 uppercase tracking-tight sm:text-lg">{fact.value}</p>
                                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-600 sm:text-[10px]">{fact.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



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

            <div className="w-full  rounded-xl bg-white shadow-md">
                <div className="flex w-max min-w-full items-center gap-1 p-3 sm:justify-center sm:p-4 sm:py-3  whitespace-nowrap">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        if (liveMatch == null && tab.key === "live-match") return <div key="live-match"></div>;
                        return (
                            <Tooltip key={tab.key} content={tab.label} className="flex-1 " contentClassName="text-md">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex h-8 w-full items-center justify-center rounded-xl px-4 transition-colors ${isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                        }`}
                                    aria-label={tab.label}
                                >
                                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 shrink-0" />
                                </button>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>

            <section>
                {renderTabPanel()}
            </section>


        </div>
    );
}
