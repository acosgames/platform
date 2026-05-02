import { useState } from "react";
import { currentPlayer, leaderboard } from "../data/mockData";
import config from "../config";
import { RoundedHexPortrait } from "./ui/RoundedHexPortrait";
import { Panel } from "./ui/Panel";

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


export function ScoreboardPane({ matchType, gamestate }: { matchType: MatchType, gamestate?: any }) {
  const [isExpanded] = useState(true);
  const letterRank = (idx: number) => String.fromCharCode(65 + (idx % 26));
  const buildStats = (score: number, idx: number, wins?: number) => {
    const kills = Math.max(2, Math.round(score / 520) + idx);
    const assists = Math.max(1, Math.round((wins ?? score / 160) / 22) + (idx % 4));
    const objectives = 1 + ((idx + Math.round(score / 1000)) % 5);
    const pingMs = 18 + ((idx * 9) % 37);
    return { kills, assists, objectives, pingMs };
  };

  // If gamestate is provided, use live data
  let baseRows: ScoreboardRow[] = [];
  if (gamestate && gamestate.players) {
    baseRows = Object.values(gamestate.players).map((player: any, idx: number) => ({
      name: player.displayname || player.name || `Player${idx+1}`,
      score: player.score || 0,
      status: player.isLocal ? "You" : "Live",
      country: player.country || "US",
      avatarUrl: player.avatarUrl || player.portrait || `https://i.pravatar.cc/80?img=${idx + 11}`,
      wins: player.wins || 0,
      team: player.team || undefined,
    }));
  } else {
    // fallback to mock data
    baseRows = [
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
        country: entry.country || "US",
        avatarUrl: `https://i.pravatar.cc/80?img=${idx + 11}`,
        wins: entry.wins,
      })),
    ].filter((row, idx, arr) => arr.findIndex((candidate) => candidate.name === row.name) === idx);
  }

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
    ...baseRows.filter((row) => row.team === "Team Alpha"),
  ]);
  const teamOmegaRows = buildDecoratedRows([
    ...baseRows.filter((row) => row.team === "Team Omega"),
  ]);

  const renderTableRow = (row: DecoratedScoreboardRow, idx: number) => {
    const countrycode = (row.country || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
    const rowClassName = row.status === "You"
      ? "bg-blue-50"
      : idx % 2 === 0
        ? "bg-white"
        : "bg-slate-50";

    return (
      <tr
        key={`${row.name}-${idx}`}
        className={`${rowClassName} border-t border-slate-200 first:border-t-0`}
      >
        <td className="align-top py-1 pl-1">
          <RoundedHexPortrait
            src={row.avatarUrl}
            alt={row.name}
            className="h-11 w-11 rounded-lg overflow-hidden"
            imageInset={5}
          />
        </td>

        <td className="align-top px-1  py-1 min-w-0">
          <p className="w-full truncate text-xs font-semibold text-slate-800">{row.name}</p>
          
          <div className="mt-1 min-w-0 flex items-center gap-1">
            <div className=" min-w-0 flex items-center gap-0">
              <span className="shrink-0 rounded  bg-slate-200 px-1.5 py-px text-[10px] font-bold text-slate-900">
                {row.gameRank}
              </span>
              {/* {row.status === "You" ? (
                <span className="shrink-0 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[10px] font-semibold text-emerald-700">
                  YOU
                </span>
              ) : null} */}
              {/* Reserved space for additional user badges */}
              <div className="flex-1 min-w-0" />
            </div>
            <img
              src={flagSrc}
              alt={`${countrycode} flag`}
              className="h-4 w-[22px] shrink-0 rounded object-cover"
              title={countrycode}
            />
            {/* <p className="shrink-0 text-xs text-slate-600">{countrycode}</p> */}

            
          </div>
        </td>

        <td className="align-top px-1 py-1 text-right text-[11px] leading-4 text-slate-700">{row.stats.kills}</td>
        <td className="align-top px-1 py-1 text-right text-[11px] leading-4 text-slate-700">{row.stats.assists}</td>
        <td className="align-top px-1 py-1 text-right text-[11px] leading-4 text-slate-700">{row.stats.objectives}</td>
        <td className="align-top px-1 py-1 text-right text-[11px] leading-4 text-slate-700">{row.stats.pingMs}</td>
        <td className="align-top px-1 py-1 text-right text-[11px] leading-4 font-semibold text-blue-700">
          {row.score.toLocaleString()}
        </td>
      </tr>
    );
  };

  const hasTeams = teamAlphaRows.length > 0 && teamOmegaRows.length > 0;

  const renderList = (rows: DecoratedScoreboardRow[], keyOffset = 0) => (
    <div className="w-full min-w-0 overflow-x-auto rounded-lg  bg-white ">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-10" />
          <col className="w-26"/>
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-7" />
          <col className="w-10" />
        </colgroup>
        <thead>
          <tr className="bg-slate-50">
            <th aria-hidden="true" className="px-1.5 py-1 text-left" />
            <th className="px-1 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">Player</th>
            <th className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">K</th>
            <th className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">A</th>
            <th className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">Obj</th>
            <th className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">MS</th>
            <th className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => renderTableRow(row, keyOffset + idx))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col space-y-2.5 overflow-hidden text-slate-800 drop-shadow-md">
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
              <Panel
                header={(
                  <div className="flex items-center justify-between gap-2">
                    {/* <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-200">Team</p> */}
                    <p className="text-xs font-black text-white">Team Alpha</p>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {teamAlphaRows.length}
                    </span>
                  </div>
                )}
              >
                {renderList(teamAlphaRows)}
              </Panel>

              <Panel
                header={(
                  <div className="flex items-center justify-between gap-2">
                    {/* <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-200">Team</p> */}
                    <p className="text-xs font-black text-white">Team Omega</p>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {teamOmegaRows.length}
                    </span>
                  </div>
                )}
              >
                {renderList(teamOmegaRows, 100)}
              </Panel>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
