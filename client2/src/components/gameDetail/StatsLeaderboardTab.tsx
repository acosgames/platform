import type { LeaderboardEntry } from "../../data/mockData";
import config from "../../config";
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
            className="h-9 w-full rounded-lg border border-white/10 bg-black/20 px-2.5 text-xs text-foreground outline-none"
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
            className="h-9 w-full rounded-lg border border-white/10 bg-black/20 px-2.5 text-xs text-foreground outline-none"
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
            className="h-9 w-full rounded-lg border border-white/10 bg-black/20 px-2.5 text-xs text-foreground outline-none"
          >
            <option value="season">Season</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {filteredStatsEntries.slice(0, 8).map((entry, idx) => {
          const countryCode = entry.country.toUpperCase();
          const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
          const value = getStatsValue(entry, idx);
          return (
            <div key={entry.rank} className="rounded-xl px-2.5 py-2 bg-card/85 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-7 w-7 rounded-md bg-white/10 text-[11px] font-bold text-foreground flex items-center justify-center">#{entry.rank}</span>
                <p className="text-sm font-semibold text-foreground truncate">{entry.player}</p>
                <img src={flagSrc} alt={`${countryCode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-white/20 shrink-0" />
              </div>
              <p className="text-sm font-bold text-cyan-700 dark:text-cyan-200 shrink-0">{value}</p>
            </div>
          );
        })}

        {filteredStatsEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">No stats available for the selected filters.</p>
        ) : null}
      </div>
    </>
  );
}
