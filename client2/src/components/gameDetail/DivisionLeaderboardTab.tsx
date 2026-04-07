import type { LeaderboardEntry } from "../../data/mockData";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
import type { SeasonKey, SeasonOption } from "./leaderboardTypes";

export function DivisionLeaderboardTab(props: {
  divisionSeasonFilter: SeasonKey;
  seasonOptions: SeasonOption[];
  divisionGroups: Record<string, LeaderboardEntry[]>;
  onDivisionSeasonChange: (value: SeasonKey) => void;
}) {
  const { divisionGroups } = props;

  return (
    <div className="space-y-3">
    

      {Object.entries(divisionGroups).map(([divisionName, entries]) => (
        <section key={divisionName} className="space-y-2">
          <div className="relative overflow-hidden rounded-md border border-cyan-300/30 bg-linear-to-r from-cyan-500/22 via-cyan-400/10 to-transparent px-3.5 py-2.5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(34,211,238,0.2),transparent_45%)]" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/75">Division</p>
                <div className="mt-0.5 flex items-center gap-1.5 min-w-0">
                  <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                  <p className="text-sm sm:text-base font-black text-cyan-50 truncate">{divisionName}</p>
                </div>
              </div>
              <div className="shrink-0 rounded-full border border-cyan-200/35 bg-black/25 px-2.5 py-1">
                <p className="text-[10px] font-semibold text-cyan-100">{entries.length} players</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {entries.slice().sort((a, b) => b.score - a.score).map((entry, idx) => (
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
