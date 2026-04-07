import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BarChart3, Settings2, UserRound, Users, Waypoints } from "lucide-react";
import { CompressedGamerCard } from "./CompressedGamerCard";
import { ChatPane } from "./ChatPane";
import { ScoreboardPane } from "./ScoreboardPane";
import { currentPlayer, friends } from "../data/mockData";
// import { MatchLogPane } from "./MatchLogPane";

type MatchType = "free-for-all" | "1v1" | "team-based";
type MiddleTab = "scoreboard" | "friends" | "profile" | "settings";

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
  const [activeTab, setActiveTab] = useState<MiddleTab>("scoreboard");
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

  const tabs: Array<{ id: MiddleTab; label: string; Icon: typeof Waypoints }> = [
    { id: "scoreboard", label: "Score", Icon: BarChart3 },
    { id: "friends", label: "Friends", Icon: Users },
    { id: "profile", label: "Profile", Icon: UserRound },
    { id: "settings", label: "Settings", Icon: Settings2 },
  ];

  const renderMiddleContent = () => {
    if (activeTab === "scoreboard") {
      return (
        <div className="h-full w-full min-h-0">
          <ScoreboardPane matchType={matchType} />
        </div>
      );
    }

    if (activeTab === "friends") {
      return (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <img src={friend.avatarUrl} alt={friend.name} className="h-7 w-7 rounded-md object-cover border border-white/20" />
                <div className="min-w-0">
                  <p className="text-xs text-white/90 truncate">{friend.name}</p>
                  <p className="text-[10px] text-white/55 truncate">{friend.currentGame ?? "No active match"}</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded border ${friend.status === "online" ? "text-green-200 border-green-400/35 bg-green-500/10" : friend.status === "in-game" ? "text-cyan-100 border-cyan-400/35 bg-cyan-500/10" : "text-white/60 border-white/20 bg-white/5"}`}>
                {friend.status}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "profile") {
      const progress = Math.max(0, Math.min(100, (currentPlayer.xp / currentPlayer.maxXp) * 100));
      return (
        <div className="space-y-3">
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.13em] text-white/65">Player Profile</p>
            <p className="mt-1 text-sm font-semibold text-white">{currentPlayer.name}</p>
            <p className="text-xs text-white/70">{currentPlayer.rank} • Level {currentPlayer.level}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-linear-to-r from-blue-500 via-cyan-300 to-emerald-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <section ref={forfeitRef} className="rounded-md border border-rose-400/20 bg-rose-500/8 backdrop-blur-sm p-3 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.12em] text-rose-100/80">Match Controls</p>
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
        <p className="text-[10px] text-rose-100/75">
          {confirmForfeit ? "Leaving now will concede the match." : "Use this only if you need to leave the match immediately."}
        </p>
      </section>
    );
  };

    

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-2 overflow-hidden">
      <div className="shrink-0">
        <CompressedGamerCard />
      </div>

      <section className="flex-1 min-h-0 rounded-md border border-slate-300/65 dark:border-white/20 bg-card ring-1 ring-slate-300/40 dark:ring-white/5 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.32)] flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-1 shrink-0">
          {tabs.map(({ id: tabId, label, Icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => {
                setActiveTab(tabId);
                setConfirmForfeit(false);
              }}
              className={`h-9 rounded-md border text-[11px] font-semibold transition-colors inline-flex items-center justify-center gap-1.5 ${
                activeTab === tabId
                  ? "border-cyan-400/45 bg-cyan-500/16 text-cyan-100"
                  : "border-white/12 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white"
              }`}
              aria-pressed={activeTab === tabId}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 panel-scrollbar">
          {renderMiddleContent()}
        </div>
      </section>

      <div className="shrink-0">
        <ChatPane />
      </div>
    </div>
  );
}
