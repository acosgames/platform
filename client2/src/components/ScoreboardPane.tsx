import { useState, useRef, useEffect } from "react";
import config from "../config";
import { RoundedHexPortrait } from "./ui/RoundedHexPortrait";
import { Panel } from "./ui/Panel";
import { btGame, btUser } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import { findGamePanelByRoom as _findGamePanelByRoom, getPrimaryGamePanel, useGame, useGamePanelUpdated, validateNextUser, clearRoom, clearPrimaryGamePanel, setRoomForfeited } from "@/actions/room";
import { wsLeaveGame } from "@/actions/ws";
import { gs } from "@acosgames/framework";

export type MatchType = "free-for-all" | "1v1" | "team-based";

type ScoreboardRow = {
  id: number;
  shortid: string;
  displayname: string;
  score: number;
  isYou: boolean;
  countrycode: string;
  portraitid: number;
  portrait: string;
  teamid?: number;
  stats: Record<string, number>;
};

type DecoratedScoreboardRow = ScoreboardRow & {
  gameRank: string;
};

export function ScoreboardPane({ roomSlug }: { roomSlug: string | null }) {
  const [isExpanded] = useState(true);
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const forfeitRef = useRef<HTMLDivElement>(null);

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

  let resolvedRoomSlug = roomSlug;
  if (resolvedRoomSlug == null) {
    const primary = getPrimaryGamePanel();
    resolvedRoomSlug = primary?.room?.room_slug ?? null;
  }

  const updated = useGamePanelUpdated(resolvedRoomSlug);

  const currentUser = useBucket(btUser) as any;
  const gameInfo = useBucket(btGame) as GameInfoFull | null;
  const scoreboardStats = (gameInfo?.stats ?? [])
    .filter((s) => s.isactive && s.scoreboard === 1)
    .sort((a, b) => (a.stat_order ?? 999) - (b.stat_order ?? 999))
    .slice(0, 4);

  const gamestate = useGame(resolvedRoomSlug, (gs) => gs) as any;

  const players: any[] = gamestate?.players ?? [];
  const teams: any[] = gamestate?.teams ?? [];


  const getMatchType = (room: any) => {
    if (!room) return "free-for-all";
    const { maxteams, maxplayers } = room;
    if (maxteams === 2 && maxplayers <= 2) return "1v1";
    if (maxteams > 2) return "team-based";
    return "free-for-all";
  }

  let matchType: MatchType = getMatchType(gamestate?.room);

  

  if (players.length === 2 && teams.length === 0) matchType = "1v1";
  if (teams.length > 1) matchType = "team-based";


  const letterRank = (idx: number) => String.fromCharCode(65 + (idx % 26));

  const baseRows: ScoreboardRow[] = players.map((player) => ({
    id: player.id,
    shortid: player.shortid,
    displayname: player.displayname || player.name || player.shortid,
    score: player.score ?? 0,
    isYou: currentUser?.shortid != null && player.shortid === currentUser.shortid,
    countrycode: player.countrycode || "US",
    portraitid: player.portraitid ?? 0,
    portrait: player.portrait ?? `https://assets.acos.games/images/portraits/assorted-${player.portraitid || 1}-medium.webp`,
    teamid: player.teamid,
    stats: Object.fromEntries(
      scoreboardStats.map((s) => [s.stat_slug, Number(player.stats?.[s.stat_abbreviation] ?? 0)])
    ),
  }));

  const buildDecoratedRows = (rows: ScoreboardRow[]) =>
    rows
      .sort((a, b) => b.score - a.score)
      .map((row, idx) => ({ ...row, gameRank: letterRank(idx) }));

  const allDecorated = buildDecoratedRows(baseRows);
  const oneVOneRows = allDecorated.slice(0, 2);
  const freeForAllRows = allDecorated.slice(0, 6);

  let game = gs(gamestate);

  const renderTableRow = (row: DecoratedScoreboardRow, idx: number) => {
    const countrycode = (row.countrycode || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
    const portraitSrc = `${config.https.cdn}images/portraits/assorted-${row.portraitid || 1}-medium.webp`;
    const rowClassName = row.isYou
      ? "bg-blue-50"
      : idx % 2 === 0
        ? "bg-white"
        : "bg-slate-50";

    const isNext = validateNextUser(row.id, game);

    return (
      <tr
        key={`${row.shortid}-${idx}`}
        className={`${rowClassName} border-t border-slate-200 first:border-t-0`}
      >
        <td className="align-top py-1 pl-1">
          <RoundedHexPortrait
            src={row.portrait}
            alt={row.displayname}
            className={`h-10 w-10  rounded-md border-3 overflow-hidden ${isNext ? "border-green-400" : "border-slate-200"} `}
            imageInset={5}
          />
        </td>

        <td className="align-top px-1  py-1 min-w-0">
          <p className="w-full truncate text-xs font-semibold text-slate-800">{row.displayname}</p>

          <div className="mt-1 min-w-0 flex items-center gap-1">
            <div className=" min-w-0 flex items-center gap-0">
              <span className="shrink-0 rounded  bg-slate-200 px-1.5 py-px text-[10px] font-bold text-slate-900">
                {row.gameRank}
              </span>
              <div className="flex-1 min-w-0" />
            </div>
            <img
              src={flagSrc}
              alt={`${countrycode} flag`}
              className="h-[12px] w-[18px] shrink-0 rounded-xs object-cover"
              title={countrycode}
            />
          </div>
        </td>

        {scoreboardStats.map((s) => (
          <td key={s.stat_slug} className="align-top px-1 py-1 text-right text-[11px] leading-4 text-slate-700">{row.stats[s.stat_slug] ?? 0}</td>
        ))}
        <td className="align-top px-1 py-1 text-right text-xs leading-4 font-semibold text-blue-700 pr-2">
          {row.score.toLocaleString()}
        </td>
      </tr>
    );
  };

  const renderList = (rows: DecoratedScoreboardRow[], keyOffset = 0) => (
    <div className="w-full min-w-0 overflow-x-auto rounded-lg  bg-white ">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-6" />
          <col className="w-26" />
          {scoreboardStats.map((s) => <col key={s.stat_slug} className="w-7" />)}
          <col className="w-10" />
        </colgroup>
        <thead>
          <tr className="bg-slate-800">
            <th aria-hidden="true" className="px-1.5 py-1 text-left" />
            <th className="px-1 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">Player</th>
            {scoreboardStats.map((s) => (
              <th key={s.stat_slug} className="px-1 py-1 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400" title={s.stat_name}>{s.stat_abbreviation}</th>
            ))}
            <th className="px-1 py-1 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => renderTableRow(row, keyOffset + idx))}
        </tbody>
      </table>
    </div>
  );

  const handleForfeit = () => {
    if (!confirmForfeit) {
      setConfirmForfeit(true);
      return;
    }
    if (!resolvedRoomSlug) return;
    setRoomForfeited(resolvedRoomSlug);
    wsLeaveGame(resolvedRoomSlug);
    clearRoom(resolvedRoomSlug);
    clearPrimaryGamePanel();
  };

  return (
    <section className="flex min-h-0 min-w-0 w-full flex-1 flex-col space-y-2.5 overflow-hidden text-slate-800 drop-shadow-md">
      {isExpanded ? (
        <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar pr-1 space-y-2">
          {matchType === "1v1" ? renderList(oneVOneRows) : null}
          {matchType === "free-for-all" ? renderList(freeForAllRows) : null}
          {matchType === "team-based" ? (
            <div className="space-y-2">
              {teams.map((team: any, tidx: number) => {
                const teamRows = allDecorated.filter((r) => r.teamid === tidx);
                if (teamRows.length === 0) return null;

                let teamColor = team.color;
                if (!teamColor) {
                  teamColor = 'var(--colors-slate-800)';
                } else {
                  teamColor = `${teamColor.toUpperCase()}`;
                }
                return (
                  <Panel
                    key={team.team_slug}
                    header={(
                      <div className={`px-4 pb-3 py-1`} style={{ backgroundColor: teamColor }}>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-black text-white">{team.name}</p>
                          <span className="rounded-full  px-2 py-0 text-[10px] font-semibold text-white">
                            {team.score != null ? team.score.toLocaleString() : `${teamRows.length} player${teamRows.length > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </div>
                    )}
                  >
                    {renderList(teamRows, tidx * 100)}
                  </Panel>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Forfeit */}
      {resolvedRoomSlug ? (
        <div ref={forfeitRef} className="shrink-0 pt-1">
          <button
            type="button"
            onClick={handleForfeit}
            className={`w-full h-8 rounded-lg border text-xs font-semibold transition-colors ${confirmForfeit
              ? "border-rose-400/60 bg-rose-500 text-white hover:bg-rose-400"
              : "border-rose-300/40 bg-rose-500/10 text-rose-600 hover:bg-rose-500/18"
              }`}
          >
            {confirmForfeit ? "Confirm Forfeit" : "Forfeit Match"}
          </button>
          {confirmForfeit ? (
            <p className="mt-1 text-[10px] text-center text-rose-500">This will concede the match.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
