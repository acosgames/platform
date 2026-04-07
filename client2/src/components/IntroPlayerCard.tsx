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
  team = "blue",
  emphasize = false,
  size = "standard",
  motionPhase = "enter",
  delayMs = 0,
}: {
  player: IntroPlayer;
  team?: "blue" | "red";
  emphasize?: boolean;
  size?: "compact" | "standard" | "hero";
  motionPhase?: "enter" | "exit";
  delayMs?: number;
}) {
  const isHero = size === "hero";
  const isCompact = size === "compact";
  const cardWidthClass = isHero
    ? "w-56 sm:w-64 md:w-72 lg:w-80"
    : isCompact
      ? "w-40 sm:w-44 md:w-52 lg:w-60"
      : "w-40 sm:w-44 md:w-60 lg:w-70 xl:w-80";
  const portraitClass = isHero
    ? "w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24"
    : isCompact
      ? "w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14"
      : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-22 xl:h-22";
  const nameClass = isHero
    ? "text-base sm:text-lg md:text-xl"
    : isCompact
      ? "text-xs sm:text-sm md:text-base"
      : "text-sm lg:text-md";
  const metaClass = isHero ? "text-[11px] sm:text-[12px] md:text-[13px]" : "text-[10px] lg:text-[12px]";
  const countrycode = (player.country || "US").toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
  const rankLabel = [player.rankLetter, player.rankLevel].filter(Boolean).join(" ");

  return (
    <article
      className={`${motionPhase === "exit" ? "vs-card-exit" : "vs-card-enter"} ${cardWidthClass} rounded-md transition-transform ${
        emphasize
          ? team == "blue" ? " ring-2 ring-white/90 -ring-offset-2" : "border-2 border-white/80 -ring-offset-2"
          : ""
      } ${team === "blue" ? 
        "bg-primary bg-linear-to-br from-primary to-black/30 to-80%" : 
        "bg-rose-600 bg-linear-to-br from-rose-600 to-black/30 to-80%"}`
      }
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center gap-0.5">
        <img
          src={player.avatarUrl}
          alt={player.name}
          className={`rounded-md object-cover border border-white/25 shrink-0 ${portraitClass}`}
        />

        <div className={`flex flex-col gap-0.5 overflow-hidden min-w-0 p-0.5 lg:p-1 xl:p-1.5`}>
          <p className={`${nameClass} font-semibold text-white truncate`}>
            {player.name}
          </p>

          <div className="flex items-center gap-1 min-w-0">
            <img src={flagSrc} alt={`${countrycode} flag`} className="w-4 h-3 rounded-[2px] object-cover border border-white/20 shrink-0" title={countrycode} />
            <p className={`${metaClass} text-white truncate`}>{countrycode}</p>
          </div>

          <p className={`${metaClass} font-semibold uppercase tracking-[0.06em] text-slate-100 truncate`}>
            Rank {rankLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
