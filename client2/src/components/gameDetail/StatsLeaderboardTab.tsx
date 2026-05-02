import { useEffect, useState } from "react";
import { StatsLeaderboardPlayerRow } from "./StatsLeaderboardPlayerRow";
import type { StatsMetric, TimeWindow } from "./leaderboardTypes";
import { findLeaderboard } from "@/actions/leaderboard";
import { btGame, btLeaderboard, btUser } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import COUNTRYCODES from "shared/model/countrycode2.json"

function getStatsValue(entry: any, metric: StatsMetric, window: TimeWindow): string {
  const scale = window === "weekly" ? 0.14 : window === "monthly" ? 0.46 : 1;
  const wins = entry.win ?? entry.wins ?? 0;
  const ties = entry.tie ?? entry.ties ?? 0;
  const losses = entry.loss ?? entry.losses ?? 0;
  const totalGames = wins + ties + losses;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  if (metric === "wins") return Math.round(wins * scale).toLocaleString();
  if (metric === "win-rate") return `${Math.round(winRate)}%`;
  // For game-specific stat slugs, look up the value by key
  const statValue = entry[metric] ?? entry[metric.toLowerCase()] ?? entry.highscore ?? entry.score ?? entry.value ?? 0;
  return Math.round(statValue * scale).toLocaleString();
}

export function StatsLeaderboardTab({ gameSlug }: { gameSlug: string }) {
  const game = useBucket(btGame) as GameInfoFull | null;
  const currentSeason = typeof game?.season === "number" ? game.season : 0;
  const [statsCountryFilter, setStatsCountryFilter] = useState("all");
  const [statsMetricFilter, setStatsMetricFilter] = useState<StatsMetric>("score");
  const [statsWindowFilter, setStatsWindowFilter] = useState<TimeWindow>(currentSeason.toString() as TimeWindow);
  const currentUser = useBucket(btUser);
  const gameStats: GameStat[] = (game?.stats ?? []).filter((s) => s.isactive);
  const allMetrics: Array<{ key: StatsMetric; label: string }> = [
    ...gameStats.sort((a, b) => a.stat_slug.localeCompare(b.stat_slug)).map((s) => ({ key: s.stat_slug as StatsMetric, label: s.stat_name })),
  ];

  // Build season options from current season down to 0
  const seasonOptions = [];
  for (let s = currentSeason; s >= 0; s--) {
    seasonOptions.push({ value: s.toString(), label: s === currentSeason ? `Current Season (${s})` : `Season ${s}` });
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!gameSlug) return;
    setLoading(true);
    setError(false);
    const isGameStat = gameStats.some((s) => s.stat_slug === statsMetricFilter);
    const config: CacheConfig = {
      type: "stat",
      game_slug: gameSlug,
      countrycode: statsCountryFilter !== "all" ? statsCountryFilter : undefined,
      monthly: statsWindowFilter === "monthly"  ? true : undefined,
      stat_slug: isGameStat ? statsMetricFilter : undefined,
      season: statsWindowFilter === "monthly"  ? -1 : Number(statsWindowFilter)
    };
    findLeaderboard(config).then((ok) => {
      if (ok) {
        const result = btLeaderboard.get() as { leaderboard?: any[]; total?: number } | null;
        const leaderboard = result?.leaderboard ?? [];
        setRows(leaderboard);

      } else {
        setRows([]);
        setError(true);
      }
      setLoading(false);
    });
  }, [gameSlug, statsCountryFilter, statsWindowFilter, statsMetricFilter]);

  return (
    <>
      <div className="bg-white rounded-lg p-2">
        <div className="bg-slate-200 p-4 py-8 rounded-lg">
          <div className="min-w-0 text-center pb-2">
            <p className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">Stats Leaderboard</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-slate-700">Country</span>
              <select
                value={statsCountryFilter}
                onChange={(e) => setStatsCountryFilter(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
              >
                <option value="all">All Countries</option>
                {COUNTRYCODES.map((c: { value: string; label: string }) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-slate-700">Stat</span>
              <select
                value={statsMetricFilter}
                onChange={(e) => setStatsMetricFilter(e.target.value as StatsMetric)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
              >
                {allMetrics.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-slate-700">Time Window</span>
              <select
                value={statsWindowFilter}
                onChange={(e) => setStatsWindowFilter(e.target.value as TimeWindow)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
              >
                {seasonOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <article
            className={`group rounded-md transition-colors bg-slate-50 drop-shadow-md relative h-16 flex items-center justify-center text-center px-4 py-3`}>

            <p className="text-xs text-slate-500">Loading…</p>
          </article>
        ) : error ? (
          <article
            className={`group rounded-md transition-colors bg-slate-50 drop-shadow-md relative h-16 flex items-center justify-center text-center px-4 py-3`}>

            <p className="text-xs text-rose-500">Failed to load stats.</p>
          </article>
        ) : rows.length === 0 ? (
          <article
            className={`group rounded-md transition-colors bg-slate-50 drop-shadow-md relative h-16 flex items-center justify-center text-center px-4 py-3`}>

            <p className="text-xs text-slate-600">No stats available for the selected filters.</p>
          </article>
        ) : (
          rows.map((entry, idx) => (
            <StatsLeaderboardPlayerRow
              key={`stats-${entry.displayname ?? entry.player}-${idx}`}
              entry={entry}
              idx={idx}
              rowKey={`stats-${entry.displayname ?? entry.player}-${idx}`}
              value={getStatsValue(entry, statsMetricFilter, statsWindowFilter)}
              isCurrentUser={!!currentUser?.shortid && entry.shortid === currentUser.shortid}
            />
          ))
        )}
      </div>
    </>
  );
}
