import type { LeaderboardSubtab } from "./leaderboardTypes";

export function LeaderboardSubtabNav({
  activeSubtab,
  onChange,
}: {
  activeSubtab: LeaderboardSubtab;
  onChange: (subtab: LeaderboardSubtab) => void;
}) {
  return (
    <div className="w-full ">
      <div className="flex w-max min-w-full justify-center ">
        <div className="inline-flex items-center rounded-full bg-white p-1 shadow-md">
          {[
            { key: "division" as const, label: "Division" },
            { key: "rank" as const, label: "Rank" },
            { key: "stats" as const, label: "Stats" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`h-7 px-4 rounded-full text-xs font-semibold transition-all ${
                activeSubtab === tab.key
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
