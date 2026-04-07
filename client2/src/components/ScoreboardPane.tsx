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

type DecoratedScoreboardRow = ScoreboardRow & {
  gameRank: string;
  stats: {
    kills: number;
    assists: number;
    objectives: number;
    pingMs: number;
  };
};

export function ScoreboardPane({ matchType }: { matchType: MatchType }) {
  const [isExpanded] = useState(true);
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

  const renderTableRow = (row: DecoratedScoreboardRow, idx: number) => {
    const countrycode = (row.country || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;

    return (
      <tr
        key={`${row.name}-${idx}`}
        className={`${row.status === "You" ? "bg-cyan-500/10" : "bg-black/15"} border-t border-white/10 first:border-t-0`}
      >
        <td className="align-top px-1.5 py-1.5 text-right">
          <img
            src={row.avatarUrl}
            alt={row.name}
            className="h-10 w-10 min-h-10 min-w-10 inline rounded-xl object-cover border border-white/60"
          />
        </td>

        <td className="align-top px-1 py-1.5 min-w-0">
          <p className="w-full text-xs font-semibold text-foreground truncate">{row.name}</p>
          <div className="mt-1 min-w-0 flex items-center gap-1.5">
            <img
              src={flagSrc}
              alt={`${countrycode} flag`}
              className="w-5 h-3 rounded-[2px] object-cover border border-white/20 shrink-0"
              title={countrycode}
            />
            <p className="text-[11px] text-white/75 shrink-0">{countrycode}</p>

            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-1.5 py-px rounded border border-cyan-400/45 bg-cyan-500/15 text-cyan-400 dark:text-cyan-200 shrink-0">
                {row.gameRank}
              </span>
              {row.status === "You" ? (
                <span className="text-[10px] font-semibold px-1.5 py-px rounded border border-emerald-400/45 bg-emerald-500/15 text-emerald-400 dark:text-emerald-200 shrink-0">
                  YOU
                </span>
              ) : null}
              {/* Reserved space for additional user badges */}
              <div className="flex-1 min-w-0" />
            </div>
          </div>
        </td>

        <td className="align-top px-1 py-1.5 text-right text-[11px] leading-4 text-white/90">{row.stats.kills}</td>
        <td className="align-top px-1 py-1.5 text-right text-[11px] leading-4 text-white/90">{row.stats.assists}</td>
        <td className="align-top px-1 py-1.5 text-right text-[11px] leading-4 text-white/90">{row.stats.objectives}</td>
        <td className="align-top px-1 py-1.5 text-right text-[11px] leading-4 text-white/90">{row.stats.pingMs}</td>
        <td className="align-top px-1 py-1.5 text-right text-[11px] leading-4 font-semibold text-cyan-400 dark:text-cyan-200">
          {row.score.toLocaleString()}
        </td>
      </tr>
    );
  };

  const hasTeams = teamAlphaRows.length > 0 && teamOmegaRows.length > 0;

  const renderList = (rows: DecoratedScoreboardRow[], keyOffset = 0) => (
    <div className="overflow-hidden ">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-10" />
          <col className="w-28"/>
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-10" />
        </colgroup>
        <thead>
          <tr className="">
            <th aria-hidden="true" className="px-1.5 py-1 text-left" />
            <th className="px-1 py-1 text-left text-[10px] uppercase tracking-wide text-white/50 font-semibold">Player</th>
            <th className="px-1 py-1 text-right text-[10px] uppercase tracking-wide text-white/50 font-semibold">K</th>
            <th className="px-1 py-1 text-right text-[10px] uppercase tracking-wide text-white/50 font-semibold">A</th>
            <th className="px-1 py-1 text-right text-[10px] uppercase tracking-wide text-white/50 font-semibold">Obj</th>
            <th className="px-1 py-1 text-right text-[10px] uppercase tracking-wide text-white/50 font-semibold">MS</th>
            <th className="px-1 py-1 text-right text-[10px] uppercase tracking-wide text-white/50 font-semibold">SCORE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => renderTableRow(row, keyOffset + idx))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="flex-1 min-h-0 flex flex-col  space-y-2.5 overflow-hidden ">
      {/* <div className="cursor-n-resize flex items-center justify-between" onClick={() => setIsExpanded((prev) => !prev)}>
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
      </div> */}

      {isExpanded ? (
        <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar pr-1 space-y-2">
          {matchType === "1v1" ? (
            renderList(oneVOneRows)
          ) : null}

          {matchType === "free-for-all" ? (
            renderList(freeForAllRows)
          ) : null}

          {matchType === "team-based" && hasTeams ? (
            <div className="space-y-2">
              <div className="space-y-0">
                <p className="text-[10px] uppercase tracking-wide text-cyan-200 font-semibold px-2">Team Alpha</p>
                {renderList(teamAlphaRows)}
              </div>

              <div className="space-y-0 pt-1 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-wide text-rose-200 font-semibold px-2">Team Omega</p>
                {renderList(teamOmegaRows, 100)}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
