import { useState } from "react";
import { friends } from "../data/mockData";

export function MatchLogPane() {
  const [isExpanded] = useState(true);
  const [entries] = useState([
    { text: "You captured Objective A", timestamp: Date.now() - 45000 },
    { text: "DragonSlayer scored +220", timestamp: Date.now() - 120000 },
    { text: "SpeedDemon eliminated 2 players", timestamp: Date.now() - 180000 },
    { text: "Team bonus activated", timestamp: Date.now() - 300000 },
    { text: "You reached streak x3", timestamp: Date.now() - 480000 },
    { text: `${friends[0]?.name ?? "Teammate"} pinged a flank route`, timestamp: Date.now() - 600000 },
  ]);

  const formatTimeAgo = (timestamp: number): string => {
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);

    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo}m ago`;
  };

  return (
    <section className="min-w-0 w-full shrink-0 space-y-2.5 overflow-hidden text-slate-800">
      {/* <div className="flex items-center cursor-n-resize justify-between" onClick={() => setIsExpanded((prev) => !prev)}>
        <h3 className="text-sm font-semibold text-foreground">Match Logs</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">Live Feed</span>
          <button
            type="button"
            aria-label={isExpanded ? "Collapse match logs" : "Expand match logs"}
            className="cursor-pointer h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isExpanded ? "▾" : "▸"}
          </button>
        </div>
      </div> */}

      {isExpanded ? (
        <div className="h-full overflow-y-auto panel-scrollbar pr-1 space-y-1">
          {entries.map((entry, idx) => (
            <div key={`${entry.text}-${idx}`} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-[11px] text-slate-700">{entry.text}</p>
                <span className="shrink-0 whitespace-nowrap text-[10px] text-slate-400">{formatTimeAgo(entry.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
