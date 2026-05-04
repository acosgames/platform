import { MatchLogPane } from "../MatchLogPane";
import { ScoreboardPane, type MatchType } from "../ScoreboardPane";

export type LivePaneTab = "scoreboard" | "match-logs";

export function LiveMatchPaneTabs({
  activeTab,
  liveMatchType,
  // title = "Spectating Match",
  onChange,
}: {
  activeTab: LivePaneTab;
  liveMatchType: MatchType;
  // title?: string;
  onChange: (tab: LivePaneTab) => void;
}) {
  return (
    <section className="flex h-full min-w-0 w-full flex-col overflow-hidden ">
      {/* <div className="flex items-center justify-between gap-3"> */}
        {/* <h3 className="text-sm font-semibold text-foreground">{title}</h3> */}
        <div className="inline-flex w-fit rounded-full bg-white p-1 mb-2">
          <button
            type="button"
            onClick={() => onChange("scoreboard")}
            className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors ${
              activeTab === "scoreboard"
                ? "bg-black text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Scoreboard
          </button>
          <button
            type="button"
            onClick={() => onChange("match-logs")}
            className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors ${
              activeTab === "match-logs"
                ? "bg-black text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Match Logs
          </button>
        {/* </div> */}
      </div>

      {activeTab === "scoreboard" ? <ScoreboardPane roomSlug={null} /> : <MatchLogPane />}
    </section>
  );
}
