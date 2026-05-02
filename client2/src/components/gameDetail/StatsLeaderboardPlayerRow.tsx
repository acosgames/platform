import config from "../../config";

const TOP3_RANK: Record<number, { rank: string; name: string }> = {
  1: { rank: "text-amber-900 bg-amber-300 border-amber-200", name: "text-slate-900 font-black" },
  2: { rank: "text-slate-700 bg-slate-200 border-slate-300", name: "text-slate-900 font-black" },
  3: { rank: "text-orange-900 bg-orange-200 border-orange-300", name: "text-slate-900 font-black" },
};

function getPortraitUrl(idx: number): string {
  return `https://i.pravatar.cc/100?img=${idx + 11}`;
}

export function StatsLeaderboardPlayerRow({
  entry,
  idx,
  rowKey,
  value,
  isCurrentUser = false,
}: {
  entry: any;
  idx: number;
  rowKey: string;
  value: string;
  isCurrentUser?: boolean;
}) {
  const playerName = entry.displayname ?? entry.player ?? "";
  const countryCode = (entry.countrycode ?? entry.country ?? "").toUpperCase();
  const rank = entry.rank ?? idx + 1;
  const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
  const portraitUrl = getPortraitUrl(idx);

  const isTop3 = rank <= 3;
  const top3 = isTop3 ? TOP3_RANK[rank] : null;

  const rowBg = isCurrentUser
    ? "bg-blue-50 ring-2 ring-blue-400 border border-blue-200"
    : idx % 2 === 0
      ? "bg-white hover:bg-slate-50 border border-slate-100"
      : "bg-slate-100 hover:bg-slate-100/70 border border-slate-100";

  const rankBlockClass = top3 ? top3.rank : "bg-slate-100 text-slate-600 border-slate-200";
  const nameClass = top3 ? top3.name : "text-slate-800 font-semibold";

  return (
    <article key={rowKey} className={`rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 transition-colors ${rowBg}`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`shrink-0 h-9 w-9 rounded-md border text-base font-black flex items-center justify-center ${rankBlockClass}`}>
            {rank}
          </div>

          <div className="relative shrink-0">
            <img
              src={portraitUrl}
              alt={`${playerName} portrait`}
              className="h-11 w-11 rounded-md object-cover border border-white/20"
            />
          </div>

          <div className="min-w-0">
            <p className={`text-sm truncate leading-tight ${nameClass}`}>{playerName}</p>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-slate-100 px-1 py-0.5 max-w-full">
              <img src={flagSrc} alt={`${countryCode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-slate-200 shrink-0" />
              <span className="text-[10px] text-slate-500 truncate">{countryCode}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right leading-tight">
          <p className="text-sm font-bold text-primary">{value}</p>
        </div>
      </div>
    </article>
  );
}