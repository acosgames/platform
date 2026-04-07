import { useState, useRef, useEffect } from "react";
import config from "../config";
import { currentPlayer } from "../data/mockData";

function rankColor(rank: string) {
  const r = rank.toLowerCase();
  if (r.includes("diamond")) return "from-cyan-400 to-blue-500";
  if (r.includes("platinum")) return "from-slate-300 to-cyan-300";
  if (r.includes("gold")) return "from-yellow-400 to-amber-500";
  if (r.includes("silver")) return "from-slate-300 to-slate-400";
  if (r.includes("bronze")) return "from-orange-400 to-amber-700";
  return "from-purple-400 to-pink-500";
}

const MENU_OPTIONS = [
  { label: "Edit Profile", icon: "✏️" },
  { label: "View Stats", icon: "📊" },
  { label: "Achievements", icon: "🏆" },
  { label: "Settings", icon: "⚙️" },
  { label: "Sign Out", icon: "🚪", danger: true },
];

interface GamerCardProps {
  isOnline?: boolean;
}

export function GamerCard({ isOnline = true }: GamerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const player = currentPlayer;
  const countrycode = (player.country || "US").toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
  const xpPercent = Math.round((player.xp / player.maxXp) * 100);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  return (
    <div className="relative z-10 rounded-md bg-linear-to-b from-slate-50/95 to-slate-100/90 dark:from-card dark:to-card border border-slate-300/65 dark:border-white/10 overflow-visible shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:shadow-lg">
      {/* Banner */}
      <div className="h-20 rounded-t-md overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-600/50 via-purple-700/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.15)_0%,transparent_70%)]" />
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 3-dot menu */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 transition-all text-white/60 hover:text-white"
          aria-label="Player options"
        >
          <span className="flex flex-col gap-0.75 items-center justify-center">
            <span className="w-0.75 h-0.75 rounded-full bg-current" />
            <span className="w-0.75 h-0.75 rounded-full bg-current" />
            <span className="w-0.75 h-0.75 rounded-full bg-current" />
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 w-44 rounded-md bg-popover border border-white/10 shadow-2xl shadow-black/50 py-1.5 overflow-hidden">
            {MENU_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setMenuOpen(false)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5 text-left ${
                  opt.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground"
                }`}
              >
                <span className="text-base leading-none">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 pb-4">
        {/* Avatar row — pulls up over the banner */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          {/* Portrait + online indicator */}
          <div className="relative">
            {/* Glow ring */}
            <div className={`absolute inset-0 rounded-full blur-md opacity-60 bg-linear-to-br ${rankColor(player.rank)}`} />
            <div className="relative ring-[3px] ring-card rounded-full">
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            {/* Online/offline dot */}
            <span
              className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card transition-colors ${
                isOnline ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" : "bg-muted"
              }`}
            />
          </div>

          {/* Rank badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-white/10 text-xs font-semibold bg-linear-to-r ${rankColor(player.rank)} bg-clip-text text-transparent`}
          >
            <svg className={`w-3 h-3 shrink-0 bg-linear-to-r ${rankColor(player.rank)}`}
              style={{ WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath d='M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32-3.87-3.77 5.34-.78z'/%3E%3C/svg%3E\")", WebkitMaskRepeat: "no-repeat", WebkitMaskSize: "contain" }}
            />
            {player.rank}
          </div>
        </div>

        {/* Name + flag + status */}
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-foreground leading-tight">{player.name}</h3>
          <img src={flagSrc} alt={`${countrycode} flag`} className="w-5 h-3.5 rounded-[2px] object-cover border border-white/20" title={countrycode} />
        </div>
        <p className={`text-xs mb-4 font-medium ${isOnline ? "text-green-400" : "text-muted-foreground"}`}>
          {isOnline ? "● Online" : "○ Offline"}
        </p>

        {/* XP / Level section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            {/* Level badge */}
            <div className="w-7 h-7 rounded-md bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(0,217,255,0.3)] shrink-0">
              <span className="text-xs font-black text-white leading-none">{player.level}</span>
            </div>

            {/* XP bar */}
            <div className="relative h-2.5 rounded-full bg-white/8 overflow-hidden flex-1">
              {/* Track glow */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
              {/* Shimmer sweep */}
              <div
                className="absolute inset-y-0 rounded-full bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* XP progress label */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground tabular-nums">
              {player.xp.toLocaleString()} / {player.maxXp.toLocaleString()} XP
            </span>
            <span className="text-xs font-semibold text-cyan-400">{xpPercent}%</span>
          </div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
