import { useState, useRef, useEffect, use } from "react";
import config from "../config";
import { RoundedHexPortrait } from "./ui/RoundedHexPortrait";
import { Panel } from "./ui/Panel";
import { btGame, btIsMobile, btPrimaryGamePanel, btUser, btTimeleft } from "@/actions/buckets";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import { findGamePanelByRoom as _findGamePanelByRoom, getPrimaryGamePanel, useGame, validateNextUser, clearRoom, clearPrimaryGamePanel, setRoomForfeited, useGameStatus, useGamePanel, useGamePanelUpdated, getGamePanel, validateNextTeam } from "@/actions/room";
import { wsJoinGame, wsLeaveGame, wsLeaveQueue } from "@/actions/ws";
import { GameStatus, gs } from "@acosgames/framework";
import { addJoinQueues } from "@/actions/queue";
import { useNavigate } from "react-router";

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
  moveTimeSec: number | null;
  stats: Record<string, number>;
};

type DecoratedScoreboardRow = ScoreboardRow & {
  gameRank: string;
};

// Extracted component for move time
function PlayerMoveTime({ gamepanelId, fallback }: { gamepanelId: string | number | undefined, fallback: number | null }) {

  // Only subscribe to the specific player's timeleft
  const moveTime = useBucketSelector(
    btTimeleft,
    (state:any): number | null => state?.[gamepanelId ?? 0] ?? 0
  );

  const seconds = Math.floor((moveTime ?? 0) / 1000);
  const milli = (moveTime ?? 0) % 1000;

  const formatMoveTime = (seconds: number | null) => {
    if (!Number.isFinite(seconds as number) || seconds == null || seconds < 0) return "--:--";

    const milli = seconds % 1000;
    seconds = seconds / 1000;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    if( seconds < 10 ) {
      return `${secs}.${String(Math.floor(milli)).padEnd(3,"0")}`;
    }
    if( seconds <= 60 ) {
      return `${String(secs).padStart(2, "0")}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  let blinkClassNameUnder10Seconds = "text-slate-700";
  if (typeof moveTime === "number" && seconds <= 9 && (seconds % 2 == 1 || seconds <= 3)) {
    blinkClassNameUnder10Seconds = "text-amber-600";
  }
  return (
    <div className={`shrink-0 rounded-xl bg-slate-200 px-2 py-1 text-md font-black tracking-wide  ${blinkClassNameUnder10Seconds}`} title="Move time remaining">
      {formatMoveTime(moveTime)}
    </div>
  );
}

export function ScoreboardPane({ roomSlug }: { roomSlug: string | null }) {
  const navigate = useNavigate();
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

  const primaryId = useBucket(btPrimaryGamePanel) as any;
  let resolvedRoomSlug = roomSlug;
  if (resolvedRoomSlug == null) {
    const primary = getGamePanel(primaryId);
    resolvedRoomSlug = primary?.room?.room_slug ?? null;
  }

  // const updated = useGamePanelUpdated(resolvedRoomSlug); // Unused
  const isMobile = useBucket(btIsMobile);
  const currentUser = useBucket(btUser) as any;
  const gameInfo = useBucket(btGame) as GameInfoFull | null;
  const scoreboardStats = (gameInfo?.stats ?? [])
    .filter((s) => s.isactive && s.scoreboard === 1)
    .sort((a, b) => (a.stat_order ?? 999) - (b.stat_order ?? 999))
    .slice(0, 4);

  const gamepanel = useGamePanel(resolvedRoomSlug);
  // Use btTimeleft keyed by gamepanel.id (room id)
 
  const gamestate = useGame(resolvedRoomSlug, (gs) => gs) as any;
  const status: GameStatus = useGameStatus(resolvedRoomSlug); 
  // const updated = useGamePanelUpdated(resolvedRoomSlug); // Used to trigger re-render when game panel updates, even if we don't use the value directly

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
    moveTimeSec: Number(
      player.move_time_left ??
      player.movetimeleft ??
      player.turn_time_left ??
      player.turntimeleft ??
      player.timeleft ??
      player.time_remaining ??
      player.timer ??
      NaN
    ),
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

  const formatMoveTime = (seconds: number | null) => {
    if (!Number.isFinite(seconds as number) || seconds == null || seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const renderPlayerCard = (row: DecoratedScoreboardRow, idx: number) => {
    const countrycode = (row.countrycode || "US").toUpperCase();
    const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;
    let rowClassName = row.isYou
      ? "bg-white "
      : idx % 2 === 0
        ? "bg-white "
        : "bg-white ";

    const isNext = validateNextUser(row.id, game);
    const isNextTeam = validateNextTeam(game, row?.teamid ?? 0);
    return (
      <div
        key={`${row.shortid}-${idx}`}
        className={`relative rounded-xl border shadow-md px-2 py-1.5 ${rowClassName} ${isNext ? "ring-2 ring-cyan-400" : ""}`}
      >
        {isNext && <div 
        className="absolute inset-0 z-0 bg-[url('https://assets.acos.games/dark-line.webp')] bg-repeat opacity-5 bg-size-[10px_10px]"
        style={{
          animation: 'bgSideScroller 1000ms linear infinite'
        }}
        ></div>}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="rounded-xl bg-linear-to-br from-slate-300 via-slate-500 to-slate-900/65 p-0.5">
              <RoundedHexPortrait
                src={row.portrait}
                alt={row.displayname}
                className={`h-12 w-12 rounded-xl border-0 overflow-hidden `}
                imageInset={5}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 pt-1">
                <h3 className="truncate text-sm font-black uppercase tracking-[0.06em] text-slate-900">
                  {row.displayname}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                  <span className="rounded bg-slate-200 px-1.5 py-px font-black text-slate-900">{row.gameRank}</span>
                  <img src={flagSrc} alt={`${countrycode} flag`} className="h-3.5 w-5 rounded-[2px] border border-slate-300 object-cover" title={countrycode} />
                  <span>{countrycode}</span>
                </div>
              </div>

              {/* Only show move time if isNext */}
              {isNext ? (
                <PlayerMoveTime gamepanelId={gamepanel?.id} fallback={row.moveTimeSec} />
              ) : null}
            </div>

            <div className="mt-2 flex items-end justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                {scoreboardStats.map((s) => (
                  <span
                    key={s.stat_slug}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-800"
                    title={s.stat_name}
                  >
                    <span className="text-slate-600">{s.stat_abbreviation}</span>
                    <span className="text-slate-900">{row.stats[s.stat_slug] ?? 0}</span>
                  </span>
                ))}
              </div>

              <div className="shrink-0 text-right leading-none text-slate-900">
                <div className="text-lg font-black tracking-wide">{row.score.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderList = (rows: DecoratedScoreboardRow[], keyOffset = 0) => (
    <div className="w-full min-w-0">
      <div className="space-y-4">
        {rows.map((row, idx) => renderPlayerCard(row, keyOffset + idx))}
      </div>
    </div>
  );

  const handleForfeit = () => {
    if (!confirmForfeit) {
      setConfirmForfeit(true);
      return;
    }
    if (!resolvedRoomSlug) return;
    // setRoomForfeited(resolvedRoomSlug);
    wsLeaveGame(resolvedRoomSlug);

    navigate("/game/" + gamepanel?.room?.game_slug);
    // clearRoom(resolvedRoomSlug);
    // clearPrimaryGamePanel();
  };

  // Post-forfeit actions
  const handlePlayAgain = () => {
    if (!gamepanel?.room?.game_slug) return;
    // Use a default mode, e.g., "rank" or "public" (since GameInfoFull has no mode)
    wsJoinGame("rank", gamepanel?.room?.game_slug);
    navigate("/game/" + gamepanel?.room?.game_slug);
  };

  const handleLeave = () => {
    if (!gameInfo) return;
    navigate("/game/" + gameInfo.game_slug);
  };

  // Determine if game is dead (status > gamestart)
  const isGameDead =
    gamestate?.room?.status !== undefined &&
    gamestate.room.status > GameStatus.gamestart;

  return (
    <section className={`flex min-h-0 min-w-0 w-full flex-1 flex-col space-y-4 text-slate-800 h-full pl-2 overflow-y-auto overflow-x-visible panel-scrollbar2 ${isMobile ? "pr-1" : ""}`}>
      {isExpanded ? (
        <div className="flex-1 min-h-0 rounded-xl space-y-4">
          {matchType === "1v1" ? renderList(oneVOneRows) : null}
          {matchType === "free-for-all" ? renderList(freeForAllRows) : null}
          {matchType === "team-based" ? (
            <div className="space-y-4">
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
                  <div className="space-y-2" key={'team-' + tidx}>
                    <div
                      className="relative flex items-center gap-2 p-2 rounded-xl shadow-md border-l-8"
                      style={{
                        borderColor: teamColor,
                        background: 'linear-gradient(90deg, rgba(30,41,59,0.98) 80%, rgba(30,41,59,0.7) 100%)',
                      }}
                    >
                      {/* Team color dot */}
                      <span
                        className="inline-block w-3 h-3 rounded-full border-2 border-white shadow mr-2"
                        style={{ background: teamColor }}
                        title={team.name + ' color'}
                      />
                      <span className="text-base font-extrabold uppercase tracking-wide text-slate-100 drop-shadow-sm flex-1">
                        {team.name}
                      </span>
                      <span className="w-full flex-1 flex items-center justify-center text-slate-300 text-xs font-mono opacity-80">
                        <PlayerMoveTime gamepanelId={gamepanel?.id} fallback={null} />
                      </span>
                      <span className="rounded-full px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-700 shadow border border-cyan-400/40">
                        {team.score != null ? team.score.toLocaleString() : `${teamRows.length} player${teamRows.length > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <div className="">
                      {renderList(teamRows, tidx * 100)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Forfeit or Post-Forfeit Actions */}
      {resolvedRoomSlug && !gamepanel?.room?.isReplay ? (
        <div ref={forfeitRef} className="shrink-0 min-h-0">
          {!isGameDead ? (
            <>
              <button
                type="button"
                onClick={handleForfeit}
                className={`w-full h-8 rounded-lg border text-xs font-semibold transition-colors ${confirmForfeit
                  ? "border-rose-400/60 bg-white text-red-600 hover:bg-slate-50"
                  : "border-rose-300/40 bg-white text-red-600 hover:bg-slate-50"
                  }`}
              >
                {confirmForfeit ? "Click again to Forfeit" : "Forfeit Match"}
              </button>
              {confirmForfeit ? (
                <p className="mt-1 text-[11px] text-center text-rose-800">This will concede the match.</p>
              ) : null}
            </>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="flex-1 h-8 rounded-lg border border-blue-400/60 bg-blue-500 text-white text-xs font-semibold hover:bg-blue-400 transition-colors"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={handleLeave}
                className="flex-1 h-8 rounded-lg border border-slate-300/60 bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors"
              >
                Leave
              </button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
