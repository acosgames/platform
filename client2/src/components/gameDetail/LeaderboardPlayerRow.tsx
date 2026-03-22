import { currentPlayer, type LeaderboardEntry } from "../../data/mockData";
import config from "../../config";

function getPortraitUrl(playerName: string, idx: number): string {
  if (playerName === currentPlayer.name) {
    return currentPlayer.avatarUrl;
  }
  return `https://i.pravatar.cc/100?img=${idx + 11}`;
}

function getRecord(wins: number, idx: number) {
  const ties = Math.max(4, Math.round(wins * 0.08) - idx);
  const losses = Math.max(10, Math.round(wins * 0.34) + idx * 3);
  return { ties, losses };
}

export function LeaderboardPlayerRow({ entry, idx, rowKey }: { entry: LeaderboardEntry; idx: number; rowKey: string }) {
  const { ties, losses } = getRecord(entry.wins, idx);
  const countryCode = entry.country.toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
  const portraitUrl = getPortraitUrl(entry.player, idx);
  const rowClass =
    entry.rank === 1
      ? "bg-amber-300/14"
      : entry.rank === 2
        ? "bg-slate-300/14"
        : entry.rank === 3
          ? "bg-orange-300/14"
          : "bg-card/85";
  const rankBlockClass =
    entry.rank === 1
      ? "bg-amber-300 text-amber-950 border-amber-100"
      : entry.rank === 2
        ? "bg-slate-300 text-slate-950 border-slate-100"
        : entry.rank === 3
          ? "bg-orange-300 text-orange-950 border-orange-100"
          : "bg-cyan-500/22 text-cyan-100 border-cyan-300/45";

  return (
    <article key={rowKey} className={`rounded-xl px-2.5 py-2 sm:px-3 sm:py-2 transition-colors ${rowClass}`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`shrink-0 h-9 w-9 rounded-md border text-base font-black flex items-center justify-center ${rankBlockClass}`}>
            {entry.rank}
          </div>

          <div className="relative shrink-0">
            <img
              src={portraitUrl}
              alt={`${entry.player} portrait`}
              className="h-9 w-9 rounded-md object-cover border border-white/20"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">{entry.player}</p>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-black/20 px-1 py-0.5 max-w-full">
              <img src={flagSrc} alt={`${countryCode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-white/20 shrink-0" />
              <span className="text-[10px] text-white/75 truncate">{countryCode}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right leading-tight">
          <p className="text-base font-bold text-cyan-700 dark:text-cyan-200">{entry.score.toLocaleString()}</p>
          <p className="text-[10px] text-white/70 mt-0.5">{entry.wins}-{ties}-{losses}</p>
        </div>
      </div>
    </article>
  );
}
