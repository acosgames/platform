import { useEffect, useState, useRef } from "react";
import { IntroPlayerCard, type IntroPlayer } from "./IntroPlayerCard";
import { MatchCountdown } from "./MatchCountdown";

type MatchType = "free-for-all" | "1v1" | "team-based";

interface PlayerScreenProps {
  gameName: string;
  gameImageUrl: string;
  matchType: MatchType;
  displayedPlayers: IntroPlayer[];
  cardMotionPhase: "enter" | "exit";
  countdownDurationMs?: number;
  showVsScreen: boolean;
  vsExiting: boolean;
}

export function PlayerScreen({
  gameName,
  gameImageUrl,
  matchType,
  displayedPlayers,
  cardMotionPhase,
  countdownDurationMs = 5000,
  showVsScreen,
  vsExiting,
}: PlayerScreenProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [screenTier, setScreenTier] = useState<"mobile" | "tablet" | "desktop">(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
    if (window.matchMedia("(min-width: 640px)").matches) return "tablet";
    return "mobile";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScreenTier = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setScreenTier("desktop");
        return;
      }

      if (window.matchMedia("(min-width: 640px)").matches) {
        setScreenTier("tablet");
        return;
      }

      setScreenTier("mobile");
    };

    updateScreenTier();
    window.addEventListener("resize", updateScreenTier);

    return () => window.removeEventListener("resize", updateScreenTier);
  }, []);

  const getFfaOverflowPortraitSize = (count: number) => {
    const viewportWidth = viewportRef.current?.clientWidth ?? 1280;
    const viewportHeight = viewportRef.current?.clientHeight ?? 720;
    const shortestSide = Math.min(viewportWidth, viewportHeight);

    // Scale portraits up for smaller overflow lobbies, while still respecting viewport limits.
    const maxSize = Math.max(64, Math.min(104, Math.floor(shortestSide * 0.20)));
    const minSize = Math.max(42, Math.min(58, Math.floor(shortestSide * 0.08)));
    const density = Math.min(1, Math.max(0, (count - 11) / 25));

    const portraitSize = Math.round(maxSize - (maxSize - minSize) * density);
    const gapSize = Math.max(4, Math.round(portraitSize * 0.14));

    return { portraitSize, gapSize };
  };

  const renderOverflowPortraits = (
    players: IntroPlayer[],
    team: "blue" | "red",
    align: "start" | "end" = "end",
    direction: "row" | "column" = "row"
  ) => {
    if (players.length === 0) return null;

    const count = players.length;
    const portraitSize = 96;
    const viewportWidth = viewportRef.current?.clientWidth ?? 1280;
    const viewportHeight = viewportRef.current?.clientHeight ?? 720;

    // Keep the whole portrait stack inside visible space for each direction.
    const maxStackSpan = direction === "row"
      ? Math.max(140, viewportWidth >= 640 ? viewportWidth * 0.6 : viewportWidth * 1.4)
      : Math.max(140, Math.floor(viewportHeight * 0.55));

    const rawStep = count === 1 ? portraitSize : Math.floor((maxStackSpan - portraitSize) / (count - 1));
    const step = Math.max(2, Math.min(portraitSize - 2, rawStep));

    const overlapMargin = -(portraitSize - step);

    return (
      <div
        className={`h-full ${direction === "row"
          ? `flex w-full items-center mt-1.5 ${align === "end" ? "justify-end" : "justify-start"}`
          : `flex flex-col items-center ${align === "end" ? "lg:items-end" : "lg:items-start"}`
          }`}
      >
        {players.map((player, idx) => (
          <div
            key={player.id}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 shadow-lg ${team === "blue" ? "border-cyan-600" : "border-rose-600"}`}
            style={{
              marginLeft: direction === "row" ? (idx === 0 ? 0 : overlapMargin) : 0,
              marginTop: direction === "column" ? (idx === 0 ? 0 : overlapMargin) : 0,
              zIndex: idx + 1,
            }}
          >
            <img
              src={player.avatarUrl}
              alt={player.name}
              title={player.name}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderTimer = () => {
    return (
      <MatchCountdown
        // durationMs={countdownDurationMs}
        className="absolute top-1 right-4 shrink-0 flex items-end justify-end lg:pt-1 pt-2"
      />
    )
  }
  const renderMatchIntro = () => {
    if (matchType === "1v1") {
      const left = displayedPlayers[0];
      const right = displayedPlayers[1];

      return (
        <>
          {renderTimer()}
          <div className="vs-intro-scale flex-1 min-h-0 flex items-center justify-center overflow-hidden px-1">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16">
              <div className="flex min-w-0">
                <IntroPlayerCard size="hero" player={left} team="blue" emphasize={true} motionPhase={cardMotionPhase} delayMs={200} />
              </div>
              <div className="text-center shrink-0">
                {/* <p className="text-[10px] uppercase tracking-[0.25em] text-white/65">Face Off</p> */}
                <p className="font-acos-logo z-1 -rotate-3 text-[64px] xl:text-[80px] font-light text-white drop-shadow-violet-700 drop-shadow-[0_0_4px_var(--color-violet-700),0_0_12px_var(--color-violet-700)]">VS</p>
              </div>
              <div className="flex min-w-0">
                <IntroPlayerCard size="hero" player={right} team="red" emphasize={false} motionPhase={cardMotionPhase} delayMs={200} />
              </div>
            </div>
          </div>
        </>
      );
    }

    if (matchType === "team-based") {
      const midpoint = Math.ceil(displayedPlayers.length / 2);
      const alphaTeam = displayedPlayers.slice(0, midpoint);
      const omegaTeam = displayedPlayers.slice(midpoint);
      const alphaCore = alphaTeam.slice(0, 3);
      const omegaCore = omegaTeam.slice(0, 3);
      const alphaOverflow = alphaTeam.slice(3);
      const omegaOverflow = omegaTeam.slice(3);
      const usePortraitGridMode = alphaTeam.length > 10 || omegaTeam.length > 10;
      const isMobile = screenTier === "mobile";
      const isTablet = screenTier === "tablet";
      const isDesktop = screenTier === "desktop";

      if (usePortraitGridMode) {
        const TeamPortraitGrid = ({
          players,
          team,
          label,
          align,
        }: {
          players: IntroPlayer[];
          team: "blue" | "red";
          label: string;
          align: "left" | "right";
        }) => (
          <div className="flex h-full min-h-0 flex-1 flex-col  p-2.5 items-center justify-center">
            <p className={`mb-2 text-xs uppercase tracking-[0.14em] font-semibold ${team === "blue" ? "text-cyan-500" : "text-rose-500"} ${align === "right" ? "text-right" : "text-left"}`}>
              {label} • {players.length}
            </p>
            <div className="grid min-h-0  grid-cols-14 gap-x-0.5 gap-y-0.5 overflow-auto panel-scrollbar pr-1 sm:grid-cols-14 md:grid-cols-7 md:gap-y-0 lg:grid-cols-7 xl:grid-cols-10">
              {players.map((player) => (
                <div
                  key={`${team}-portrait-${player.id}`}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${team === "blue" ? "border-cyan-600/80" : "border-rose-600/80"}`}
                  title={player.name}
                >
                  <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <>
            {renderTimer()}
            <div className="flex-1 w-full h-full flex items-center justify-center">
              <div className="vs-intro-scale flex h-full w-full flex-1 min-h-0 flex-col items-stretch justify-center gap-2 overflow-hidden px-1 md:flex-row lg:gap-6">
                <TeamPortraitGrid players={alphaTeam} team="blue" label="Team Alpha" align="left" />

                <div className="relative shrink-0 self-center text-center">
                  <p className="font-acos-logo z-1 -rotate-3 text-[18px] sm:text-[24px] lg:text-[48px]  xl:text-[76px] font-light text-white drop-shadow-violet-700 drop-shadow-[0_0_13px_var(--color-violet-700),0_0_16px_var(--color-violet-700)]">VS</p>
                </div>

                <TeamPortraitGrid players={omegaTeam} team="red" label="Team Omega" align="right" />
              </div>
            </div>
          </>
        );
      }

      return (
        <>
          {/* <div className="absolute w-full h-20 top-0 right-0"> */}
          {renderTimer()}
          {/* </div> */}
          <div className="flex-1 w-full h-full flex items-center justify-center gap-4 sm:gap-8">
            <div className="vs-intro-scale flex-1 min-h-0 w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center overflow-hidden px-1 gap-2 sm:gap-10">

              <div className="flex-1 w-full min-w-0 space-y-0 flex flex-col items-start sm:items-end">
                <p className="text-md uppercase tracking-[0.14em] text-cyan-600 font-semibold text-left sm:text-right">Team Alpha</p>
                {isTablet ? (
                  <>
                    <div className="flex flex-col gap-3 items-end">
                      {alphaCore.map((player, idx) => (
                        <IntroPlayerCard
                          size="compact"
                          team="blue"
                          key={player.id}
                          player={player}
                          emphasize={idx === 0}
                          motionPhase={cardMotionPhase}
                          delayMs={220 + idx * 80}
                        />
                      ))}
                    </div>
                    <div>{renderOverflowPortraits(alphaOverflow, "blue", "start")}</div>
                  </>
                ) : null}
                {isDesktop ? (
                  <div className="flex items-end justify-end gap-3 w-full h-full">
                    {renderOverflowPortraits(alphaOverflow, "blue", "end", "column")}
                    <div className="flex flex-col gap-3 items-end">
                      {alphaCore.map((player, idx) => (
                        <IntroPlayerCard
                          size="compact"
                          team="blue"
                          key={`alpha-lg-${player.id}`}
                          player={player}
                          emphasize={idx === 0}
                          motionPhase={cardMotionPhase}
                          delayMs={220 + idx * 80}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                {isMobile ? <div>{renderOverflowPortraits(alphaTeam, "blue", "start")}</div> : null}
              </div>

              <div className="shrink-0 self-center text-center relative mt-2 sm:mt-0">
                <p className="font-acos-logo z-1 -rotate-3 text-[40px] sm:text-[80px] xl:text-[100px] font-light text-white drop-shadow-violet-700 drop-shadow-[0_0_5px_var(--color-violet-700),0_0_10px_var(--color-violet-700)]">VS</p>

              </div>

              <div className="flex-1 w-full min-w-0 space-y-0 flex flex-col items-end sm:items-start">
                {!isMobile ? <p className="text-md uppercase tracking-[0.14em] text-rose-600 font-semibold text-right sm:text-left">Team Omega</p> : null}
                {isTablet ? (
                  <>
                    <div className="flex flex-col gap-3 items-start">
                      {omegaCore.map((player, idx) => (
                        <IntroPlayerCard
                          size="compact"
                          key={player.id}
                          player={player}
                          motionPhase={cardMotionPhase}
                          delayMs={220 + idx * 80}
                          team="red"
                        />
                      ))}
                    </div>
                    <div>{renderOverflowPortraits(omegaOverflow, "red", "end")}</div>
                  </>
                ) : null}
                {isDesktop ? (
                  <div className="flex items-start justify-start gap-3 w-full">
                    <div className="flex flex-col gap-3 items-start">
                      {omegaCore.map((player, idx) => (
                        <IntroPlayerCard
                          size="compact"
                          key={`omega-lg-${player.id}`}
                          player={player}
                          motionPhase={cardMotionPhase}
                          delayMs={220 + idx * 80}
                          team="red"
                        />
                      ))}
                    </div>
                    {renderOverflowPortraits(omegaOverflow, "red", "start", "column")}
                  </div>
                ) : null}
                {isMobile ? <div>{renderOverflowPortraits(omegaTeam, "red", "end")}</div> : null}
                {isMobile ? <p className="pt-1 text-md uppercase tracking-[0.14em] text-rose-600 font-semibold text-right sm:text-left">Team Omega</p> : null}
              </div>
            </div>
          </div>

        </>
      );
    }

    const usePortraitCards = displayedPlayers.length > 10;
    const { portraitSize, gapSize } = getFfaOverflowPortraitSize(displayedPlayers.length);

    return (
      <div className="vs-intro-scale flex-1 min-h-0 flex items-center justify-center overflow-hidden px-1">
        <div className="w-full space-y-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-100 font-semibold text-center">Free for All</p>

          {!usePortraitCards ? (
            <div className="w-full flex flex-wrap items-center justify-center gap-2">
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
          ) : (
            <div className="w-full max-h-[70vh] overflow-y-auto panel-scrollbar pr-1">
              <div className="flex flex-wrap items-center justify-center" style={{ gap: `${gapSize}px` }}>
                {displayedPlayers.map((player, idx) => (
                  <div
                    key={`ffa-portrait-${player.id}`}
                    className={`rounded-md overflow-hidden border-2 shadow-lg ${idx === 0 ? "border-cyan-400" : "border-white/25"}`}
                    style={{ width: `${portraitSize}px`, height: `${portraitSize}px` }}
                    title={player.name}
                  >
                    <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {showVsScreen ? (
        <div ref={viewportRef} className="absolute inset-0 z-10 flex items-center justify-center  ">

          <div className={` relative ${vsExiting ? "vs-screen-exit" : "vs-screen-enter"} w-full h-full   bg-black p-3 sm:p-2 flex flex-col justify-start gap-2 lg:gap-5 overflow-hidden`}>
            <div className="absolute -z-1 inset-0 bg-linear-to-b from-black/30 via-black/55 to-black/80" />
            <div className="absolute -z-4 inset-0 bg-linear-to-r from-cyan-500/15 via-transparent to-rose-500/15" />
            <div className="absolute -z-5 inset-0 bg-linear-to-r from-transparent from-45% via-purple-500/20  to-transparent to-55%" />
            <div className="absolute -z-5 inset-0 bg-linear-to-r from-transparent from-48% via-purple-500/5  to-transparent to-52%" />
            <div className="absolute -z-2 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[15vw] h-[15vw] rounded-full bg-radial from-cyan-500/25 via-purple-500/20 to-transparent blur-3xl" />
            <div className="absolute -z-3 bottom-[50%] right-[50%] transform translate-x-1/2 translate-y-1/2 w-[15vw] h-[15vw] rounded-full bg-radial from-pink-500/25 via-purple-500/20 to-transparent blur-3xl" />
            <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden -z-10">
              <svg className="background-svg top" width="calc(100% + 160px)" height="100%">
                <pattern id="pattern-aztec-top" x="0" y="0" width="160" height="78" patternUnits="userSpaceOnUse">
                  <path stroke="white" opacity="0.3"
                    strokeWidth="4" fill="none" d="m 0 32 h 28 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 32" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-aztec-top)"></rect>
              </svg>
              <svg className="background-svg bottom" width="calc(100% + 160px)" height="100%">
                <pattern id="pattern-aztec-bottom" x="0" y="0" width="160" height="78" patternUnits="userSpaceOnUse">
                  <path stroke="white" opacity="0.3"
                    strokeWidth="4" fill="none" d="m 0 71 h 18 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 m -178 -30 h 8 v 20 h -8" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-aztec-bottom)"></rect>
              </svg>
            </div>
            <div className="shrink-0 flex items-start gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img src={gameImageUrl} alt={`${gameName} cover`} className="w-14 h-14 rounded-md object-cover border border-white/20" />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">{gameName}</h1>
                  <p className="text-xs text-white/70">Combatants entering arena</p>
                </div>
              </div>
            </div>


            {renderMatchIntro()}


          </div>
        </div>
      ) : null}
    </>
  );
}
