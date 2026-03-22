import config from "../config";

export type IntroPlayer = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
  rankLetter: string;
  rankLevel: string;
};

export function IntroPlayerCard({
  player,
  emphasize = false,
  size = "standard",
  motionPhase = "enter",
  delayMs = 0,
}: {
  player: IntroPlayer;
  emphasize?: boolean;
  size?: "compact" | "standard" | "hero";
  motionPhase?: "enter" | "exit";
  delayMs?: number;
}) {
  const isHero = size === "hero";
  const isCompact = size === "compact";
  const rankSizeClass = isHero ? "h-6 w-6 text-md font-semibold" : isCompact ? "h-6 w-6 text-md font-semibold" : "h-8 w-8 text-sm";
  const countrycode = (player.country || "US").toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;

  return (
    <article
      className={`${motionPhase === "exit" ? "vs-card-exit" : "vs-card-enter"} rounded-xl border ${isCompact ? "p-2" : "p-3"} backdrop-blur-sm transition-transform ${isHero ? "w-52 max-w-full flex flex-col" : ""} ${
        emphasize
          ? "border-cyan-300/45 bg-cyan-500/15 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
          : "border-white/15 bg-black/30"
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className={`${isCompact ? "flex items-stretch gap-2 space-y-0 " : isHero ? "h-full flex flex-col gap-1" : "h-full flex flex-col gap-1"}`}>
        <img
          src={player.avatarUrl}
          alt={player.name}
          className={`rounded-lg object-cover border border-white/25 ${isHero ? "w-full aspect-square" : isCompact ? "h-14 w-14 shrink-0" : "w-full h-20 sm:h-24"}`}
        />

        <div className="inline-flex flex-col gap-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <p className={`${isHero ? "text-base  sm:text-md" : isCompact ? "text-[14px]" : "text-sm"} font-semibold text-white truncate`}>{player.name}</p>
          </div>
          <div className="flex  gap-1.5 min-w-0 ">
            <img src={flagSrc} alt={`${countrycode} flag`} className={`${isCompact ? "w-5 h-4" : "w-5 h-4"} rounded-[2px] object-cover border border-white/20 shrink-0`} title={countrycode} />
            <p className={`${isCompact ? "text-[10px]" : "text-[11px]"} text-white/75 truncate`}>{countrycode}</p>
          </div>
        </div>

        <span
          className={`${rankSizeClass} ${isCompact ? "" : "mt-0"} absolute bottom-2 right-2 inline-flex items-center justify-center rounded-md px-1.5   text-white bg-linear-to-br from-slate-500 to-slate-950`}
        >
          {player.rankLetter}
        </span>
      </div>
    </article>
  );
}
