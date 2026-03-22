import type { LeaderboardSubtab } from "./leaderboardTypes";

export function LeaderboardSubtabNav({
  activeSubtab,
  onChange,
}: {
  activeSubtab: LeaderboardSubtab;
  onChange: (subtab: LeaderboardSubtab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[
        { key: "division" as const, label: "Division" },
        { key: "rank" as const, label: "Rank" },
        { key: "stats" as const, label: "Stats" },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-colors ${
            activeSubtab === tab.key
              ? "bg-cyan-500/20 text-cyan-100"
              : "bg-white/6 text-foreground/75 hover:text-cyan-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
