import type { LeaderboardEntry } from "../../data/mockData";
import { StatsLeaderboardPlayerRow } from "./StatsLeaderboardPlayerRow";
import type { StatsMetric, TimeWindow } from "./leaderboardTypes";

export function StatsLeaderboardTab({
  statsCountryFilter,
  statsMetricFilter,
  statsWindowFilter,
  leaderboardCountries,
  filteredStatsEntries,
  getStatsValue,
  onStatsCountryChange,
  onStatsMetricChange,
  onStatsWindowChange,
}: {
  statsCountryFilter: string;
  statsMetricFilter: StatsMetric;
  statsWindowFilter: TimeWindow;
  leaderboardCountries: string[];
  filteredStatsEntries: LeaderboardEntry[];
  getStatsValue: (entry: LeaderboardEntry, idx: number) => string;
  onStatsCountryChange: (value: string) => void;
  onStatsMetricChange: (value: StatsMetric) => void;
  onStatsWindowChange: (value: TimeWindow) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Country</span>
          <select
            value={statsCountryFilter}
            onChange={(e) => onStatsCountryChange(e.target.value)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
          >
            <option value="all">All Countries</option>
            {leaderboardCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Stat</span>
          <select
            value={statsMetricFilter}
            onChange={(e) => onStatsMetricChange(e.target.value as StatsMetric)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
          >
            <option value="score">Score</option>
            <option value="wins">Wins</option>
            <option value="win-rate">Win Rate</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Time Window</span>
          <select
            value={statsWindowFilter}
            onChange={(e) => onStatsWindowChange(e.target.value as TimeWindow)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none"
          >
            <option value="season">Season</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {filteredStatsEntries.slice().sort((a, b) => b.score - a.score).slice(0, 8).map((entry, idx) => {
          const value = getStatsValue(entry, idx);
          return (
            <StatsLeaderboardPlayerRow
              key={`stats-${entry.rank}-${entry.player}`}
              entry={entry}
              idx={idx}
              rowKey={`stats-${entry.rank}-${entry.player}`}
              value={value}
            />
          );
        })}

        {filteredStatsEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">No stats available for the selected filters.</p>
        ) : null}
      </div>
    </>
  );
}
