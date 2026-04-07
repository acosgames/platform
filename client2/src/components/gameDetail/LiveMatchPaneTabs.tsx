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
    <section className="flex flex-col rounded-md  bg-card  h-full">
      {/* <div className="flex items-center justify-between gap-3"> */}
        {/* <h3 className="text-sm font-semibold text-foreground">{title}</h3> */}
        <div className="inline-flex rounded-full border border-white/12 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => onChange("scoreboard")}
            className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors ${
              activeTab === "scoreboard"
                ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/35"
                : "text-foreground/70 hover:text-cyan-100"
            }`}
          >
            Scoreboard
          </button>
          <button
            type="button"
            onClick={() => onChange("match-logs")}
            className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors ${
              activeTab === "match-logs"
                ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/35"
                : "text-foreground/70 hover:text-cyan-100"
            }`}
          >
            Match Logs
          </button>
        {/* </div> */}
      </div>

      {activeTab === "scoreboard" ? <ScoreboardPane matchType={liveMatchType} /> : <MatchLogPane />}
    </section>
  );
}
