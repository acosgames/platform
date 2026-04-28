import type { LeaderboardEntry } from "../../data/mockData";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
import type { TimeWindow } from "./leaderboardTypes";

export function RankLeaderboardTab({
  rankCountryFilter,
  rankSeasonFilter,
  leaderboardCountries,
  filteredRankEntries,
  onRankCountryChange,
  onRankSeasonChange,
}: {
  rankCountryFilter: string;
  rankSeasonFilter: TimeWindow;
  leaderboardCountries: string[];
  filteredRankEntries: LeaderboardEntry[];
  onRankCountryChange: (value: string) => void;
  onRankSeasonChange: (value: TimeWindow) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Country</span>
          <select
            value={rankCountryFilter}
            onChange={(e) => onRankCountryChange(e.target.value)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
          >
            <option value="all">All Countries</option>
            {leaderboardCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Season</span>
          <select
            value={rankSeasonFilter}
            onChange={(e) => onRankSeasonChange(e.target.value as TimeWindow)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
          >
            <option value="season">Current Season</option>
            <option value="monthly">Monthly Snapshot</option>
            <option value="weekly">Weekly Snapshot</option>
          </select>
        </label>
      </div>

      <div className="space-y-2.5">
        {filteredRankEntries.slice().sort((a, b) => b.score - a.score).slice(0, 8).map((entry, idx) => (
          <LeaderboardPlayerRow key={`rank-${entry.rank}`} entry={entry} idx={idx} rowKey={`rank-${entry.rank}`} />
        ))}

        {filteredRankEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">No players for the selected country/season.</p>
        ) : null}
      </div>
    </>
  );
}
