import { useState } from "react";
import { currentPlayer, leaderboard } from "../data/mockData";
import config from "../config";

export type MatchType = "free-for-all" | "1v1" | "team-based";

type ScoreboardRow = {
  name: string;
  score: number;
  status: "You" | "Live";
  country: string;
  avatarUrl: string;
  wins: number;
  team?: "Team Alpha" | "Team Omega";
};

export function ScoreboardPane({ matchType }: { matchType: MatchType }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const letterRank = (idx: number) => String.fromCharCode(65 + (idx % 26));
  const buildStats = (score: number, idx: number, wins?: number) => {
    const kills = Math.max(2, Math.round(score / 520) + idx);
    const assists = Math.max(1, Math.round((wins ?? score / 160) / 22) + (idx % 4));
    const objectives = 1 + ((idx + Math.round(score / 1000)) % 5);
    const pingMs = 18 + ((idx * 9) % 37);
    return { kills, assists, objectives, pingMs };
  };

  const baseRows = [
    {
      name: currentPlayer.name,
      score: 1240,
      status: "You" as const,
      country: currentPlayer.country,
      avatarUrl: currentPlayer.avatarUrl,
      wins: 112,
    },
    ...leaderboard.slice(0, 5).map((entry, idx) => ({
      name: entry.player,
      score: entry.score,
      status: entry.player === currentPlayer.name ? ("You" as const) : ("Live" as const),
      country: entry.country,
      avatarUrl: `https://i.pravatar.cc/80?img=${idx + 11}`,
      wins: entry.wins,
    })),
  ].filter((row, idx, arr) => arr.findIndex((candidate) => candidate.name === row.name) === idx);

  const buildDecoratedRows = (rows: ScoreboardRow[]) =>
    rows.map((row, idx) => ({
      ...row,
      gameRank: letterRank(idx),
      stats: buildStats(row.score, idx, row.wins),
    }));

  const oneVOneRows = buildDecoratedRows(baseRows.slice(0, 2));

  const freeForAllRows = buildDecoratedRows(
    [...baseRows]
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  );

  const teamAlphaRows = buildDecoratedRows([
    { ...baseRows[0], team: "Team Alpha" as const },
    ...baseRows.slice(1, 3).map((row) => ({ ...row, team: "Team Alpha" as const })),
  ]);

  const teamOmegaRows = buildDecoratedRows(
    baseRows.slice(3, 6).map((row) => ({ ...row, team: "Team Omega" as const }))
  );

  const renderRow = (
    row: {
      name: string;
      score: number;
      status: "You" | "Live";
      country: string;
      avatarUrl: string;
      gameRank: string;
      stats: { kills: number; assists: number; objectives: number; pingMs: number };
    },
    idx: number,
  ) => {
    const countrycode = (row.country || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;

    return (
      <div
        key={`${row.name}-${idx}`}
        className={`rounded-md border px-2.5 py-2 flex items-start justify-between gap-2 ${
          row.status === "You"
            ? "border-cyan-300/35 bg-cyan-500/10"
            : "border-white/10 bg-black/15"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <img src={row.avatarUrl} alt={row.name} className="h-8 w-8 rounded-md object-cover border border-white/20 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{row.name}</p>
              <div className="flex pt-0.5 gap-1.5 min-w-0 items-center">
                <img src={flagSrc} alt={`${countrycode} flag`} className="w-5 h-3 rounded-[2px] object-cover border border-white/20 shrink-0" title={countrycode} />
                <p className="text-[11px] text-white/75 truncate">{countrycode}</p>
              </div>
            </div>
          </div>
          <div className="mt-1 grid grid-cols-4 gap-1 text-[10px]">
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/85 text-center">
              K <span className="font-semibold text-white">{row.stats.kills}</span>
            </span>
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/85 text-center">
              A <span className="font-semibold text-white">{row.stats.assists}</span>
            </span>
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/85 text-center">
              OBJ <span className="font-semibold text-white">{row.stats.objectives}</span>
            </span>
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/85 text-center">
              P <span className="font-semibold text-white">{row.stats.pingMs}</span>
            </span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end justify-start gap-1">
          <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-200">{row.score.toLocaleString()}</p>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-400/45 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200">
            {row.gameRank}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="rounded-lg border border-white/20 bg-linear-to-b from-card to-card/85  dark:from-gray-950 dark:to-black backdrop-blur-sm ring-1 ring-white/5 p-3.5 space-y-2.5 shrink-0 overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
      <div className="cursor-n-resize flex items-center justify-between" onClick={() => setIsExpanded((prev) => !prev)}>
        <h3 className="text-sm font-semibold text-foreground">Scoreboard</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">
            {matchType === "1v1" ? "Duel" : matchType === "team-based" ? "Teams" : "FFA"}
          </span>
          <button
            type="button"
            aria-label={isExpanded ? "Collapse scoreboard" : "Expand scoreboard"}
            className="cursor-pointer h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isExpanded ? "▾" : "▸"}
          </button>
        </div>
      </div>

      {isExpanded ? (
        <div className="max-h-64 overflow-y-auto panel-scrollbar pr-1 space-y-2">
          {matchType === "1v1" ? (
            <div className="space-y-1.5">{oneVOneRows.map((row, idx) => renderRow(row, idx))}</div>
          ) : null}

          {matchType === "free-for-all" ? (
            <div className="space-y-1.5">{freeForAllRows.map((row, idx) => renderRow(row, idx))}</div>
          ) : null}

          {matchType === "team-based" ? (
            <div className="space-y-2">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wide text-cyan-200 font-semibold">Team Alpha</p>
                {teamAlphaRows.map((row, idx) => renderRow(row, idx))}
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-wide text-rose-200 font-semibold">Team Omega</p>
                {teamOmegaRows.map((row, idx) => renderRow(row, 100 + idx))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
