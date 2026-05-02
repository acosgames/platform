import { useEffect, useState } from "react";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
//
import { findLeaderboard } from "@/actions/leaderboard";
import { btLeaderboard, btUser, btGame } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import COUNTRYCODES from "shared/model/countrycode2.json"
export function RankLeaderboardTab({ gameSlug }: { gameSlug: string }) {
  const game = useBucket<any>(btGame);
  const currentSeason = typeof game?.season === "number" ? game.season : 0;
  const [rankCountryFilter, setRankCountryFilter] = useState("all");
  const [rankSeasonFilter, setRankSeasonFilter] = useState<string>(currentSeason.toString());
  const currentUser = useBucket(btUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  // Build season options from current season down to 0
  const seasonOptions = [];
  for (let s = currentSeason; s >= 0; s--) {
    seasonOptions.push({ value: s.toString(), label: s === currentSeason ? `Current Season (${s})` : `Season ${s}` });
  }
  // No longer need countries state; use COUNTRYCODES for dropdown

  useEffect(() => {
    if (!gameSlug) return;
    setLoading(true);
    setError(false);
    const config: CacheConfig = {
      type: "rank",
      game_slug: gameSlug,
      countrycode: rankCountryFilter !== "all" ? rankCountryFilter : undefined,
      season: rankSeasonFilter === "monthly"  ? -1 : Number(rankSeasonFilter),
      monthly: rankSeasonFilter === "monthly"  ? true : undefined,
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
  }, [gameSlug, rankCountryFilter, rankSeasonFilter]);

  return (
    <>
      <div className="bg-white rounded-lg p-2">
        <div className="bg-slate-200 p-4 py-8 rounded-lg">
          <div className="min-w-0 text-center pb-2">
            <p className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">Rank Leaderboard</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-slate-700">Country</span>
              <select
                value={rankCountryFilter}
                onChange={(e) => setRankCountryFilter(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
              >
                <option value="all">All Countries</option>
                {COUNTRYCODES.map((c: { value: string; label: string }) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-wide text-slate-700">Season</span>
              <select
                value={rankSeasonFilter}
                onChange={(e) => setRankSeasonFilter(e.target.value)}
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

      <div className="space-y-2.5">
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
            <LeaderboardPlayerRow
              key={`rank-${entry.displayname ?? entry.player}-${idx}`}
              entry={entry}
              idx={idx}
              rowKey={`rank-${entry.displayname ?? entry.player}-${idx}`}
              highlightTop3
              displayRank={entry.rank ?? idx + 1}
              isCurrentUser={!!currentUser?.shortid && entry.shortid === currentUser.shortid}
            />
          ))
        )}
      </div>
    </>
  );
}
