import { useEffect, useState } from "react";
import { EyeIcon, SignalIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import type { MatchType } from "../ScoreboardPane";
import { LiveMatchPaneTabs, type LivePaneTab } from "./LiveMatchPaneTabs";

export type LiveMatchInfo = {
  title: string;
  viewers: number;
  mode: string;
  elapsed: string;
};

export function LiveMatchSection({
  gameName,
  gameImageUrl,
  liveMatch,
  liveMatchType,
}: {
  gameName: string;
  gameImageUrl: string;
  liveMatch: LiveMatchInfo;
  liveMatchType: MatchType;
}) {
  const [showLiveFeedHud, setShowLiveFeedHud] = useState(true);
  const [activeLivePaneTab, setActiveLivePaneTab] = useState<LivePaneTab>("scoreboard");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLiveFeedHud(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [liveMatch]);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4">
      <section className="rounded-2xl overflow-hidden border border-rose-400/20 bg-card/95">
        <div
          className="relative min-h-88 sm:min-h-96 overflow-hidden"
          onMouseEnter={() => setShowLiveFeedHud(true)}
          onMouseLeave={() => setShowLiveFeedHud(false)}
        >
          <img src={gameImageUrl} alt={`${gameName} live feed`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black/88" />
          <div className="absolute inset-0 bg-linear-to-r from-rose-500/12 via-transparent to-cyan-500/12" />

          <div className={`relative z-10 flex h-full flex-col p-4 sm:p-5 transition-opacity duration-500 ease-in-out ${showLiveFeedHud ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center justify-between gap-3 transition-opacity duration-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_0_14px_rgba(244,63,94,0.6)]">
                  <SignalIcon className="h-3 w-3" />
                  Live Feed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 backdrop-blur-sm">
                  <UserGroupIcon className="h-3 w-3" />
                  {liveMatch.mode}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
                  <EyeIcon className="h-3 w-3" />
                  {liveMatch.viewers}
                </span>
                <span className="rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">{liveMatch.elapsed}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white truncate">{liveMatch.title}</p>
                <p className="text-xs text-white/70">Spectating a live ranked session already in progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveMatchPaneTabs activeTab={activeLivePaneTab} liveMatchType={liveMatchType} onChange={setActiveLivePaneTab} />
    </section>
  );
}
