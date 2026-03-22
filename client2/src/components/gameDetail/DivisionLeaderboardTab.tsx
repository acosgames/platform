import type { LeaderboardEntry } from "../../data/mockData";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
import type { SeasonKey, SeasonOption } from "./leaderboardTypes";

export function DivisionLeaderboardTab({
  divisionSeasonFilter,
  seasonOptions,
  divisionGroups,
  onDivisionSeasonChange,
}: {
  divisionSeasonFilter: SeasonKey;
  seasonOptions: SeasonOption[];
  divisionGroups: Record<string, LeaderboardEntry[]>;
  onDivisionSeasonChange: (value: SeasonKey) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label className="space-y-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Season</span>
          <select
            value={divisionSeasonFilter}
            onChange={(e) => onDivisionSeasonChange(e.target.value as SeasonKey)}
            className="h-9 w-full rounded-lg border border-white/10 bg-black/20 px-2.5 text-xs text-foreground outline-none"
          >
            {seasonOptions.map((season) => (
              <option key={season.key} value={season.key}>{season.label}</option>
            ))}
          </select>
        </label>
        <div className="rounded-lg bg-black/18 px-3 py-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Division Capacity</p>
          <p className="text-xs font-semibold text-cyan-100">30 max players</p>
        </div>
      </div>

      {Object.entries(divisionGroups).map(([divisionName, entries]) => (
        <section key={divisionName} className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-cyan-500/12 px-3 py-2">
            <p className="text-xs font-semibold text-cyan-100">Division: {divisionName}</p>
            <p className="text-[10px] text-white/70">{entries.length} players</p>
          </div>
          <div className="space-y-2">
            {entries.map((entry, idx) => (
              <LeaderboardPlayerRow
                key={`${divisionName}-${entry.player}`}
                entry={entry}
                idx={idx}
                rowKey={`${divisionName}-${entry.player}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
