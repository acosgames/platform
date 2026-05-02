import { useEffect, useState, type ReactNode } from "react";
import { EyeIcon, SignalIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import type { MatchType } from "../ScoreboardPane";
import { LiveMatchPaneTabs, type LivePaneTab } from "./LiveMatchPaneTabs";

export type LiveMatchInfo = {
  title: string;
  viewers: number;
  mode: string;
  elapsed: string;
};

type LiveMatchSectionMode = "live" | "replay";

export function LiveMatchSection({
  gameName,
  gameImageUrl,
  liveMatch,
  liveMatchType,
  mode = "live",
  description,
  mediaHeightClassName,
//   actionBar,
  // paneTitle,
}: {
  gameName: string;
  gameImageUrl: string;
  liveMatch: LiveMatchInfo;
  liveMatchType: MatchType;
  mode?: LiveMatchSectionMode;
  description?: string;
  mediaHeightClassName?: string;
  actionBar?: ReactNode;
  // paneTitle?: string;
}) {
  const [showLiveFeedHud, setShowLiveFeedHud] = useState(true);
  const [activeLivePaneTab, setActiveLivePaneTab] = useState<LivePaneTab>("scoreboard");
  const isReplay = mode === "replay";

  useEffect(() => {
    if (isReplay) {
      setShowLiveFeedHud(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowLiveFeedHud(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isReplay, liveMatch]);

  return (
    <section className="grid grid-cols-1 gap-2 sm:grid-cols-[5fr_4fr] w-full mx-auto">
      <section className={`relative overflow-hidden rounded-md  ${mediaHeightClassName ?? ""}`}>
        <div
          className="relative  overflow-hidden  max-w-[30vw] "
          onMouseEnter={() => setShowLiveFeedHud(true)}
          onMouseLeave={() => {
            if (!isReplay) {
              setShowLiveFeedHud(false);
            }
          }}
        >
          <img
            src={gameImageUrl}
            alt={`${gameName} live feed`}
            className={`relative w-full h-full ${isReplay ? "object-contain bg-slate-900" : "object-cover"}`}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black/88" />
          <div className={`absolute inset-0 bg-linear-to-r ${isReplay ? "from-amber-500/12 via-transparent to-cyan-500/12" : "from-rose-500/12 via-transparent to-cyan-500/12"}`} />

          <div className={`absolute inset-0 z-10 flex h-full flex-col p-4 sm:p-5 transition-opacity duration-500 ease-in-out ${showLiveFeedHud ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center justify-between gap-3 transition-opacity duration-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white ${isReplay ? "bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.55)]" : "bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.6)]"}`}>
                  <SignalIcon className="h-3 w-3" />
                  {isReplay ? "Replay" : "Live Feed"}
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
                <p className="text-xs text-white/70">{description ?? (isReplay ? "Reviewing a recorded match with timeline controls and instant skip options." : "Spectating a live ranked session already in progress.")}</p>
              </div>
            </div>

            {/* {actionBar ? <div className="mt-auto pt-4">{actionBar}</div> : null} */}
          </div>
        </div>
      </section>

      <LiveMatchPaneTabs activeTab={activeLivePaneTab} liveMatchType={liveMatchType} onChange={setActiveLivePaneTab} />
    </section>
  );
}
