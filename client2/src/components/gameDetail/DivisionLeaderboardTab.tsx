import { currentPlayer, type LeaderboardEntry } from "../../data/mockData";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
import type { SeasonKey, SeasonOption } from "./leaderboardTypes";
import config from "../../config";

function getPortraitUrl(playerName: string, idx: number): string {
  if (playerName === currentPlayer.name) {
    return currentPlayer.avatarUrl;
  }
  return `https://i.pravatar.cc/320?img=${idx + 11}`;
}

const PLACE_STYLES: Record<number, { badge: string; card: string; label: string; portraitBg: string }> = {
  1: {
    badge: "bg-amber-300 text-amber-900 ",
    card: "border border-amber-200/80 mb-0 sm:mb-8",
    label: "1st Place",
    portraitBg: "bg-linear-to-br from-yellow-300 via-amber-400 to-orange-500",
  },
  2: {
    badge: "bg-slate-200 text-slate-700 ",
    card: "border border-slate-200 ",
    label: "2nd Place",
    portraitBg: "bg-linear-to-br from-slate-200 via-slate-400 to-slate-600",
  },
  3: {
    badge: "bg-orange-200 text-orange-900 ",
    card: "border border-orange-200/80 ",
    label: "3rd Place",
    portraitBg: "bg-linear-to-br from-amber-300 via-orange-500 to-rose-600",
  },
};

function DivisionPodiumCard({
  entry,
  idx,
  place,
}: {
  entry: LeaderboardEntry;
  idx: number;
  place: 1 | 2 | 3;
}) {
  const countryCode = entry.country.toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
  const portraitUrl = getPortraitUrl(entry.player, idx);
  const style = PLACE_STYLES[place];

  return (
    <div className="flex w-full flex-col items-stretch sm:min-w-44 sm:w-auto">
      <article className={`overflow-hidden rounded-xl bg-white ${style.card}`}>
        <div className="flex items-stretch sm:hidden">
          <div className={`relative flex w-20 shrink-0 items-center justify-center ${style.portraitBg}`}>
            <div className="h-12 w-12 bg-white [clip-path:polygon(50%_0%,94%_25%,94%_75%,50%_100%,6%_75%,6%_25%)]">
              <img
                src={portraitUrl}
                alt={`${entry.player} portrait`}
                className="h-full w-full object-cover [clip-path:polygon(50%_0%,94%_25%,94%_75%,50%_100%,6%_75%,6%_25%)] transform-[scale(0.92)]"
              />
            </div>
            <div className={`absolute left-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${style.badge}`}>
              {place}
            </div>
          </div>
          <div className="min-w-0 flex-1 px-3 py-2">
            <p className="truncate text-sm font-black text-slate-800">{entry.player}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{style.label}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <img src={flagSrc} alt={`${countryCode} flag`} className="h-3.5 w-5 rounded-[2px] border border-slate-200 object-cover" />
              <span className="text-[10px] font-semibold text-slate-500">{countryCode}</span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-primary">{entry.score.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={`relative hidden h-28 sm:block ${style.portraitBg}`}>
          <div className="absolute inset-x-0 bottom-0 mx-auto h-24 w-24 bg-white shadow-md [clip-path:polygon(50%_0%,94%_25%,94%_75%,50%_100%,6%_75%,6%_25%)]">
            <img
              src={portraitUrl}
              alt={`${entry.player} portrait`}
              className="h-full w-full object-cover [clip-path:polygon(50%_0%,94%_25%,94%_75%,50%_100%,6%_75%,6%_25%)] transform-[scale(0.92)]"
            />
          </div>
          <div className={`absolute left-2 top-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full  px-2 text-xs font-black ${style.badge}`}>
            {place}
          </div>
        </div>
        <div className="hidden px-3 pb-3 pt-2.5 text-center sm:block">
          <p className="truncate text-sm font-black text-slate-800">{entry.player}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{style.label}</p>
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-slate-50 px-2 py-1.5">
            <img src={flagSrc} alt={`${countryCode} flag`} className="h-3.5 w-5 rounded-[2px] border border-slate-200 object-cover" />
            <span className="text-[10px] font-semibold text-slate-500">{countryCode}</span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] font-semibold text-primary">{entry.score.toLocaleString()}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

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
          {(() => {
            const sortedEntries = entries.slice().sort((a, b) => b.score - a.score);
            const topThree = sortedEntries.slice(0, 3);
            const rest = sortedEntries.slice(3);

            return (
              <>
                <div className="sm:hidden relative overflow-hidden rounded-2xl bg-blue-500">
                  <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2">
                    <div />
                    <div className="min-w-0 text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Division</p>
                      <div className="mt-0.5 flex min-w-0 items-center justify-center gap-1.5">
                        <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-white" />
                        <p className="truncate text-sm font-black text-white">{divisionName}</p>
                      </div>
                    </div>
                    <div className="justify-self-end shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
                      <p className="text-[10px] font-semibold text-slate-600">{entries.length} players</p>
                    </div>
                  </div>
                </div>

                {topThree.length > 0 ? (
                  <div className="sm:hidden space-y-2">
                    {topThree[0] ? <DivisionPodiumCard entry={topThree[0]} idx={0} place={1} /> : null}
                    {topThree[1] ? <DivisionPodiumCard entry={topThree[1]} idx={1} place={2} /> : null}
                    {topThree[2] ? <DivisionPodiumCard entry={topThree[2]} idx={2} place={3} /> : null}
                  </div>
                ) : null}

                <div className="hidden sm:block relative overflow-hidden rounded-2xl  bg-blue-500  ">
                  
                  <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-2 ">
                    <div />
                    <div className="min-w-0 text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Division</p>
                      <div className="mt-0.5 flex items-center justify-center gap-1.5 min-w-0">
                        <SparklesIcon className="h-3.5 w-3.5 shrink-0 text-white" />
                        <p className="text-sm sm:text-base font-black text-white truncate">{divisionName}</p>
                      </div>
                    </div>
                    <div className="justify-self-end shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
                      <p className="text-[10px] font-semibold text-slate-600">{entries.length} players</p>
                    </div>
                  </div>

                  {topThree.length > 0 ? (
                    <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100  py-2 ">
                      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.98),rgba(255,255,255,0)_58%)]" /> */}
                      {/* <div className="absolute inset-x-10 bottom-0 h-16 rounded-full bg-slate-300/20 blur-2xl" /> */}
                      <div className="relative overflow-x-auto pb-1">
                        <div className="flex w-max min-w-full items-end justify-center gap-2.5 px-1 pt-1">
                        {topThree[1] ? <DivisionPodiumCard entry={topThree[1]} idx={1} place={2} /> : null}
                        {topThree[0] ? <DivisionPodiumCard entry={topThree[0]} idx={0} place={1} /> : null}
                        {topThree[2] ? <DivisionPodiumCard entry={topThree[2]} idx={2} place={3} /> : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  {rest.map((entry, idx) => (
                    <LeaderboardPlayerRow
                      key={`${divisionName}-${entry.player}`}
                      entry={entry}
                      idx={idx + 3}
                      rowKey={`${divisionName}-${entry.player}`}
                    />
                  ))}

                  {rest.length === 0 ? (
                    <p className="text-xs text-slate-500">No additional players in this division.</p>
                  ) : null}
                </div>
              </>
            );
          })()}
        </section>
      ))}
    </div>
  );
}
