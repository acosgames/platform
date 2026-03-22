import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Link, useParams, useNavigate } from "react-router";
import { currentPlayer, games, leaderboard } from "../data/mockData";
import { type MatchType } from "../components/ScoreboardPane";
import { DivisionLeaderboardTab } from "../components/gameDetail/DivisionLeaderboardTab";
import { LeaderboardSubtabNav } from "../components/gameDetail/LeaderboardSubtabNav";
import { RankLeaderboardTab } from "../components/gameDetail/RankLeaderboardTab";
import { StatsLeaderboardTab } from "../components/gameDetail/StatsLeaderboardTab";
import { LiveMatchSection } from "../components/gameDetail/LiveMatchSection";
import type { LeaderboardSubtab, SeasonKey, StatsMetric, TimeWindow } from "../components/gameDetail/leaderboardTypes";
import { useMatchmakingQueue } from "../context/MatchmakingQueueContext";

type DetailTab = "watch-replay" | "leaderboards" | "career-stats" | "game-description" | "tournaments";

export function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueue } = useMatchmakingQueue();
  const [activeTab, setActiveTab] = useState<DetailTab>("leaderboards");
  const [activeLeaderboardSubtab, setActiveLeaderboardSubtab] = useState<LeaderboardSubtab>("division");
  const [divisionSeasonFilter, setDivisionSeasonFilter] = useState<SeasonKey>("s12");
  const [rankCountryFilter, setRankCountryFilter] = useState("all");
  const [rankSeasonFilter, setRankSeasonFilter] = useState<TimeWindow>("season");
  const [statsCountryFilter, setStatsCountryFilter] = useState("all");
  const [statsMetricFilter, setStatsMetricFilter] = useState<StatsMetric>("score");
  const [statsWindowFilter, setStatsWindowFilter] = useState<TimeWindow>("season");
  const game = games.find((g) => g.id === id);

  if (!game) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Game not found</h2>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-background bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
        >
          Back to Games
        </Link>
      </div>
    );
  }

  const gameSeed = Number(game.id);
  const totalGamesPlayed = game.players * (18 + gameSeed * 3);
  const yourGamesPlayed = 80 + currentPlayer.level * 3 + gameSeed * 7;
  const avgGameTimeMinutes = 14 + gameSeed * 3;
  const heartReactions = Math.round(game.players * (7.5 + game.rating) + gameSeed * 230);
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

  const handlePlayNow = () => {
    enqueue({ gameId: game.id, gameName: game.name });
    navigate(`/game/${game.id}/play`);
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
        <div className="space-y-2.5">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-lg border border-white/10 bg-black/20 px-3.5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{game.name} Replay #{idx}</p>
                <p className="text-xs text-muted-foreground truncate">Featured by {topPlayer} • {12 + idx * 4} min</p>
              </div>
              <button className="shrink-0 h-8 px-3 rounded-md text-xs font-semibold text-background bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                Watch
              </button>
            </div>
          ))}
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
          <div className="rounded-xl border border-cyan-400/20 bg-card/90 p-3.5 sm:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Rating History</p>
                <p className="text-sm font-semibold text-foreground">Per Match Progression</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-base font-bold text-cyan-700 dark:text-cyan-200">{latestRating.toLocaleString()}</p>
                <p className={`text-[11px] ${ratingDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {ratingDelta >= 0 ? "+" : ""}{ratingDelta} last match
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-black/20 border border-white/10 p-2 overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-135 h-48 sm:h-56">
                <defs>
                  <linearGradient id="career-rating-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34 211 238 / 0.42)" />
                    <stop offset="100%" stopColor="rgb(34 211 238 / 0.03)" />
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
                <path d={chartPathD} fill="none" stroke="rgb(56 189 248)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {ratingPoints.filter((_, idx) => idx % 4 === 0 || idx === ratingPoints.length - 1).map((point) => (
                  <circle key={point.match} cx={point.x} cy={point.y} r="3.5" fill="rgb(125 211 252)" />
                ))}
              </svg>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Match 1</span>
              <span>Match {ratingHistory.length}</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-3.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Career Level</p>
            <p className="mt-1 text-xl font-bold text-foreground">{currentPlayer.level}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Current Rank</p>
            <p className="mt-1 text-xl font-bold text-cyan-700 dark:text-cyan-300">{currentPlayer.rank}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3.5 sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">XP Progress</p>
              <p className="text-xs text-cyan-700 dark:text-cyan-300">{Math.round((currentPlayer.xp / currentPlayer.maxXp) * 100)}%</p>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-linear-to-r from-cyan-500 to-purple-500" style={{ width: `${Math.round((currentPlayer.xp / currentPlayer.maxXp) * 100)}%` }} />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "game-description") {
      return (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {game.description} In this mode, players compete across tactical objectives, dynamic map hazards, and evolving challenge rounds. Team coordination, quick decision-making, and adaptive loadouts are key to climbing seasonal rankings.
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
          <div key={t.name} className="rounded-lg border border-white/10 bg-black/20 p-3.5 space-y-1">
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.time}</p>
            <p className="text-xs text-cyan-700 dark:text-cyan-300 font-semibold">Prize Pool: {t.prize}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-4">
        <div>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-lg font-semibold text-sm text-background bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 active:scale-95"
        >
          ← Back to Games
        </Link>
      </div>
      
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-white/10 bg-card">
        <img src={game.imageUrl} alt={game.name} className="w-full h-56 sm:h-64 lg:h-72 object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/45 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-transparent to-purple-500/10" />

        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
          <div className="shrink-0 rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-300/35 dark:bg-rose-500/15 dark:text-rose-200 shadow-[0_8px_24px_rgba(244,63,94,0.22)] backdrop-blur-sm">
            ❤ {heartReactions.toLocaleString()}
          </div>
        </div>

        <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-10">
          <div className="relative">
            <span className="absolute -inset-2 rounded-[1.8rem] bg-radial-[circle_at_center] from-cyan-300/75 via-cyan-400/30 to-transparent blur-2xl opacity-95 group-hover:opacity-100" />
            <button
              type="button"
              onClick={handlePlayNow}
              className="group relative inline-flex items-center gap-3 h-13 px-4 sm:px-5 rounded-[1.35rem] border border-cyan-100/80 ring-2 ring-cyan-300/35 text-white bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 shadow-[0_18px_42px_rgba(0,0,0,0.52),0_0_26px_rgba(34,211,238,0.45)] hover:shadow-[0_22px_54px_rgba(0,0,0,0.56),0_0_38px_rgba(34,211,238,0.65)] hover:ring-cyan-200/60 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.985] overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-cyan-300/0 via-white/12 to-cyan-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute -left-14 top-0 h-full w-12 bg-linear-to-r from-transparent via-cyan-100/70 to-transparent rotate-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-72 transition-all duration-700" />
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-cyan-200 to-cyan-400 border border-white/45 shadow-[0_0_18px_rgba(103,232,249,0.65)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110 shrink-0">
                <PlayIcon className="h-4 w-4 text-slate-950" />
              </span>
              <span className="flex flex-col leading-[1.02] text-left transition-transform duration-300 group-hover:translate-x-0.5">
                <span>Play Now</span>
                <span className="text-[9px] font-bold tracking-[0.16em] text-cyan-100/80">Competitive Match</span>
              </span>
            </button>
            {/* <span className="absolute -top-2 -right-2 z-20 rounded-full bg-rose-500 text-white text-[9px] px-1.5 py-0.5 tracking-wide shadow-[0_0_12px_rgba(244,63,94,0.7)]">
              LIVE
            </span> */}
          </div>
        </div>

        <div className="absolute left-4 right-4 top-4 sm:left-6 sm:right-6 sm:top-auto sm:bottom-6">
          <div className="flex items-end gap-3 min-w-0 pr-0 sm:pr-44">
            {/* Foreground game image card */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-xl bg-linear-to-br from-cyan-500/40 to-purple-500/40 blur-lg" />
              <img
                src={game.imageUrl}
                alt={`${game.name} cover`}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/20 shadow-xl"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-tight truncate">{game.name}</h1>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-white/80 truncate">by {game.developer}</p>
            </div>
          </div>
        </div>
      </section>

      {liveMatch ? <LiveMatchSection gameName={game.name} gameImageUrl={game.imageUrl} liveMatch={liveMatch} liveMatchType={liveMatchType} /> : null}
          <section className="rounded-xl border border-white/10 bg-card/90 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/12 text-cyan-800 dark:text-cyan-200">
                {game.category}
              </span>
              {game.genre.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/75"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {game.description} 
            </p>

            <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="text-green-400">⬤ {game.players.toLocaleString()} online</span>
              <span>Release: {game.releaseDate}</span>
              <span>Rating: {game.rating.toFixed(1)}</span>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-card/90 p-4 bg-linear-to-br from-white/3 to-transparent"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                <p className="mt-1.5 text-lg font-semibold text-foreground truncate">{stat.value}</p>
              </div>
            ))}
          </section>

      {/* Bottom tabbed detail section */}
      <section className="rounded-2xl border border-cyan-400/20 bg-card/95 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300">
            Game Hub
          </h2>
          <span className="text-[11px] px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200">Live Data</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                activeTab === tab.key
                  ? "border-cyan-400/45 bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-800 dark:text-cyan-100 shadow-[0_0_16px_rgba(0,217,255,0.25)]"
                  : "border-white/12 bg-white/5 text-foreground/70 hover:border-cyan-400/35 hover:text-cyan-700 dark:hover:text-cyan-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-card/60 p-3.5 sm:p-4">
          {renderTabPanel()}
        </div>
      </section>

      
    </div>
  );
}
