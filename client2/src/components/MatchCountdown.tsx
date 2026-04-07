import { useEffect, useRef, useState } from "react";

export function MatchCountdown({
  durationMs = 5000,
  className,
}: {
  durationMs?: number;
  className?: string;
}) {
  const endTimeRef = useRef<number>(Date.now() + durationMs);
  const [remainingMs, setRemainingMs] = useState(durationMs);

  useEffect(() => {
    endTimeRef.current = Date.now() + durationMs;
    setRemainingMs(durationMs);
  }, [durationMs]);

  useEffect(() => {
    const tick = () => {
      const next = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMs(next);
    };

    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, []);

  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className={className}>
      <p className="flex flex-col items-center justify-center text-sm sm:text-base text-white/90 text-center">
        {seconds > 0 ? (
          <>
            <span className="font-light text-md sm:text-md text-white uppercase font-acos-logo tracking-widest leading-4 block">
              Starting
            </span>
            <span className="font-acos-logo block text-lg sm:text-[1.5rem] font-light text-white">{seconds}</span>
          </>
        ) : (
          <span className="font-light text-md sm:text-md text-white uppercase font-acos-logo tracking-widest leading-4 block">
            Match is live
          </span>
        )}
      </p>
    </div>
  );
}
