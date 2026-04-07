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

const TOP3_RANK: Record<number, { rank: string; name: string }> = {
  1: { rank: "text-amber-950 bg-amber-300 border-amber-200",   name: "text-amber-200 font-black" },
  2: { rank: "text-slate-950 bg-slate-300 border-slate-200",   name: "text-slate-200 font-black" },
  3: { rank: "text-orange-950 bg-orange-300 border-orange-200", name: "text-orange-200 font-black" },
};

export function LeaderboardPlayerRow({ entry, idx, rowKey }: { entry: LeaderboardEntry; idx: number; rowKey: string }) {
  const { ties, losses } = getRecord(entry.wins, idx);
  const countryCode = entry.country.toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
  const portraitUrl = getPortraitUrl(entry.player, idx);

  const isTop3 = entry.rank <= 3;
  const top3 = isTop3 ? TOP3_RANK[entry.rank] : null;

  const rowBg = idx % 2 === 0
    ? "bg-blue-950/55 hover:bg-blue-900/60"
    : "bg-blue-900/25 hover:bg-blue-900/40";

  const rankBlockClass = top3
    ? top3.rank
    : "bg-cyan-950/60 text-cyan-300 border-cyan-500/30";

  const nameClass = top3 ? top3.name : "text-foreground font-semibold";

  return (
    <article key={rowKey} className={`rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 transition-colors ${rowBg}`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Rank */}
          <div className={`shrink-0 h-9 w-9 rounded-md border text-base font-black flex items-center justify-center ${rankBlockClass}`}>
            {entry.rank}
          </div>

          {/* Portrait */}
          <div className="relative shrink-0">
            <img
              src={portraitUrl}
              alt={`${entry.player} portrait`}
              className="h-11 w-11 rounded-md object-cover border border-white/20"
            />
          </div>

          {/* Name + flag */}
          <div className="min-w-0">
            <p className={`text-sm truncate leading-tight ${nameClass}`}>{entry.player}</p>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-black/20 px-1 py-0.5 max-w-full">
              <img src={flagSrc} alt={`${countryCode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-white/20 shrink-0" />
              <span className="text-[10px] text-white/60 truncate">{countryCode}</span>
            </div>
          </div>
        </div>

        {/* Score + record */}
        <div className="shrink-0 text-right leading-tight space-y-1">
          <p className="text-sm font-bold text-cyan-300">{entry.score.toLocaleString()}</p>
          <div className="flex items-center gap-0.5 justify-end">
            <span className="text-[10px] font-semibold text-emerald-400">{entry.wins}</span>
            <span className="text-white/60 text-[10px]">-</span>
            <span className="text-[10px] font-semibold text-amber-400">{ties}</span>
            <span className="text-white/60 text-[10px]">-</span>
            <span className="text-[10px] font-semibold text-rose-400">{losses}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

