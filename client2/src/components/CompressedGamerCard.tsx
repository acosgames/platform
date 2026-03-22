import { useEffect, useRef, useState } from "react";
import config from "../config";
import { currentPlayer } from "../data/mockData";

interface CompressedGamerCardProps {
  isOnline?: boolean;
}

const MENU_OPTIONS = [
  { label: "Edit Profile", icon: "✏️" },
  { label: "View Stats", icon: "📊" },
  { label: "Achievements", icon: "🏆" },
  { label: "Settings", icon: "⚙️" },
  { label: "Sign Out", icon: "🚪", danger: true },
];

export function CompressedGamerCard({ isOnline = true }: CompressedGamerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const player = currentPlayer;
  const countrycode = (player.country || "US").toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
  const xpPercent = Math.round((player.xp / player.maxXp) * 100);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [menuOpen]);

  return (
    <div className="relative z-10 rounded-lg border border-white/20 bg-linear-to-b from-card to-card/85 backdrop-blur-sm ring-1 ring-white/5 px-3.5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img src={player.avatarUrl} alt={player.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
              isOnline ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.75)]" : "bg-muted"
            }`}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-foreground truncate">{player.name}</h3>
                <img src={flagSrc} alt={`${countrycode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-white/20" title={countrycode} />
              </div>
              <p className={`text-[11px] ${isOnline ? "text-green-400" : "text-muted-foreground"}`}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-bold text-white bg-linear-to-br from-cyan-500 to-purple-600">
                {player.level}
              </span>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-6 w-6 rounded-md border border-white/15 bg-black/25 hover:bg-black/45 transition-colors flex flex-col items-center justify-center gap-0.5"
                  aria-label="Player options"
                >
                  <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                  <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                  <span className="h-0.75 w-0.75 rounded-full bg-white/80" />
                </button>

                {menuOpen && (
                <div className="absolute right-0 top-9 w-44 rounded-xl bg-popover border border-white/10 shadow-2xl shadow-black/50 py-1.5 overflow-hidden">
                    {MENU_OPTIONS.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => setMenuOpen(false)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/10 text-left ${
                        opt.danger ? "text-destructive hover:bg-destructive/50" : "text-foreground"
                        }`}
                    >
                        <span className="text-base leading-none">{opt.icon}</span>
                        {opt.label}
                    </button>
                    ))}
                </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">XP</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-medium">{xpPercent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
