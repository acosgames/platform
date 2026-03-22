import { IntroPlayerCard, type IntroPlayer } from "./IntroPlayerCard";

type MatchType = "free-for-all" | "1v1" | "team-based";

interface PlayerScreenProps {
  gameName: string;
  gameImageUrl: string;
  matchType: MatchType;
  displayedPlayers: IntroPlayer[];
  cardMotionPhase: "enter" | "exit";
  countdown: number;
  showVsScreen: boolean;
  vsExiting: boolean;
}

export function PlayerScreen({
  gameName,
  gameImageUrl,
  matchType,
  displayedPlayers,
  cardMotionPhase,
  countdown,
  showVsScreen,
  vsExiting,
}: PlayerScreenProps) {
  const renderMatchIntro = () => {
    if (matchType === "1v1") {
      const left = displayedPlayers[0];
      const right = displayedPlayers[1];

      return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
          <div className="flex justify-end">
            <IntroPlayerCard player={left} emphasize={true} size="hero" motionPhase={cardMotionPhase} delayMs={60} />
          </div>
          <div className="justify-self-center text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/65">Face Off</p>
            <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-200 via-white to-rose-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]">
              VS
            </p>
          </div>
          <div className="flex justify-start">
            <IntroPlayerCard player={right} size="hero" motionPhase={cardMotionPhase} delayMs={170} />
          </div>
        </div>
      );
    }

    if (matchType === "team-based") {
      const alphaTeam = displayedPlayers.slice(0, 3);
      const omegaTeam = displayedPlayers.slice(3, 6);

      return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-5 items-start">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-100 font-semibold">Team Alpha</p>
            <div className="grid grid-cols-2 gap-2">
              {alphaTeam.map((player, idx) => (
                <IntroPlayerCard
                  size="compact"
                  key={player.id}
                  player={player}
                  emphasize={idx === 0}
                  motionPhase={cardMotionPhase}
                  delayMs={idx * 80}
                />
              ))}
            </div>
          </div>

          <p className="hidden lg:block self-center text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-200 via-white to-rose-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]">VS</p>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-rose-100 font-semibold">Team Omega</p>
            <div className="grid grid-cols-2 gap-2">
              {omegaTeam.map((player, idx) => (
                <IntroPlayerCard
                  size="compact"
                  key={player.id}
                  player={player}
                  motionPhase={cardMotionPhase}
                  delayMs={220 + idx * 80}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-100 font-semibold">Free for All</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {displayedPlayers.map((player, idx) => (
            <IntroPlayerCard
              key={player.id}
              player={player}
              emphasize={idx === 0}
              size="compact"
              motionPhase={cardMotionPhase}
              delayMs={idx * 40}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
      {showVsScreen ? (
        <div className={`${vsExiting ? "vs-screen-exit" : "vs-screen-enter"} w-full h-full rounded-2xl border border-white/15 bg-black/90 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-start gap-5`}>
          <div className="flex-1 flex  items-start gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={gameImageUrl} alt={`${gameName} cover`} className="w-14 h-14 rounded-lg object-cover border border-white/20" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">{gameName}</h1>
                <p className="text-xs text-white/70">Combatants entering arena</p>
              </div>
            </div>
          </div>

          {renderMatchIntro()}

          <div className="flex-1 flex items-end justify-center">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base text-white/90 text-center">
              {countdown > 0 ? (
                <>
                  Match starts in <span className="text-xl font-bold text-white">{countdown}</span>
                </>
              ) : (
                <span className="font-black text-white">Match is live</span>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
