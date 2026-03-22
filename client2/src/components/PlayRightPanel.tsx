import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CompressedGamerCard } from "./CompressedGamerCard";
import { ChatPane } from "./ChatPane";
import { ScoreboardPane, type MatchType } from "./ScoreboardPane";
import { MatchLogPane } from "./MatchLogPane";

function getMatchType(id: string): MatchType {
  const n = Number(id);
  if (!Number.isFinite(n)) return "team-based";
  if (n % 3 === 1) return "1v1";
  if (n % 3 === 2) return "free-for-all";
  return "team-based";
}

export function PlayRightPanel() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const matchType = getMatchType(id ?? "");
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const forfeitRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!confirmForfeit) return;
    const handler = (e: MouseEvent) => {
      if (forfeitRef.current && !forfeitRef.current.contains(e.target as Node)) {
        setConfirmForfeit(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [confirmForfeit]);

  const handleForfeit = () => {
    if (!confirmForfeit) {
      setConfirmForfeit(true);
      return;
    }

    navigate(id ? `/game/${id}` : "/");
  };

    

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden">
      <CompressedGamerCard isOnline={true} />
      <ScoreboardPane matchType={matchType} />
      {/* <MatchLogPane /> */}
      <ChatPane />
      <section ref={forfeitRef} className="rounded-lg border border-rose-400/20 bg-rose-500/8 backdrop-blur-sm p-3 shrink-0 space-y-2">
        <button
          type="button"
          onClick={handleForfeit}
          className={`w-full h-10 rounded-md border text-xs font-semibold transition-colors ${
            confirmForfeit
              ? "border-rose-300/50 bg-rose-500 text-white hover:bg-rose-400"
              : "border-rose-300/30 bg-rose-500/14 text-rose-100 hover:bg-rose-500/22"
          }`}
        >
          {confirmForfeit ? "Confirm Forfeit" : "Forfeit Match"}
        </button>
        {/* <p className="text-[10px] text-rose-100/75 text-center">
          {confirmForfeit ? "Leaving now will concede the match." : "Exit the current match and return to the game page."}
        </p> */}
      </section>
    </div>
  );
}
