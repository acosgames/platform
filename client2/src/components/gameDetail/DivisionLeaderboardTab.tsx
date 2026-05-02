
import { useEffect, useState } from "react";
import { LeaderboardPlayerRow } from "./LeaderboardPlayerRow";
import type { SeasonKey, SeasonOption } from "./leaderboardTypes";
import { findLeaderboard } from "@/actions/leaderboard";
import { btGame, btLeaderboard, btPlayerStats, btUser } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import { useLoading } from "@/actions/loading";


export function DivisionLeaderboardTab(props: {
  divisionSeasonFilter: SeasonKey;
  seasonOptions: SeasonOption[];
  onDivisionSeasonChange: (value: SeasonKey) => void;
  gameSlug: string;
  gameDivisionId?: string;
  gameDivisionName?: string;
}) {
  // seasonOptions and onDivisionSeasonChange are reserved for a season picker UI
  const { divisionSeasonFilter, gameSlug, gameDivisionId, gameDivisionName } = props;

  const currentUser = useBucket(btUser);
  const game = useLoading('game/' + gameSlug, btGame);
  const playerStats = useBucket(btPlayerStats) as Record<string, any>;

  // Prefer the user's own division for this game (from btPlayerStats), fall back to game-level division
  const playerStat = gameSlug ? playerStats?.[gameSlug] : null;
  const divisionId = playerStat?.division_id ?? game?.division_id ?? "";
  const divisionName = playerStat?.division_name ?? game?.division_name ?? divisionId;

  const [loading, setLoading] = useState(false);
  const [divisionRows, setDivisionRows] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!divisionId || !gameSlug) return;
    setLoading(true);
    setError(false);
    const config: CacheConfig = {
      type: "divisionmulti",
      game_slug: gameSlug,
      division_id: divisionId,
    };
    findLeaderboard(config).then((ok: any) => {
      if (ok) {
        const result = btLeaderboard.get() as { leaderboard?: any[]; total?: number } | null;
        setDivisionRows(result?.leaderboard ?? []);
      } else {
        setDivisionRows([]);
        setError(true);
      }
      setLoading(false);
    });
  }, [divisionId, gameSlug, divisionSeasonFilter]);

  // Rank and tie logic
  const rankedRows = divisionRows.map((entry, idx, arr) => {
    const prevRank = idx > 0 ? (arr[idx - 1] as any)._displayRank ?? idx : undefined;
    const displayRank =
      idx > 0 && entry.rating === arr[idx - 1].rating ? prevRank! : idx + 1;
    (entry as any)._displayRank = displayRank;
    return {
      entry,
      idx,
      displayRank,
      tieWithNext: arr[idx + 1] != null && arr[idx + 1].rating === entry.rating,
      tieWithPrev: idx > 0 && arr[idx - 1].rating === entry.rating,
      isCurrentUser: !!currentUser?.shortid && entry.shortid === currentUser.shortid,
    };
  });

  return (
    <div className="space-y-3 ">
      <div className="relative drop-shadow-md">
        <div className="overflow-hidden rounded-xl bg-white ">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl gap-3 px-4 py-8 m-2 bg-slate-200">
            <div />
            <div className="min-w-0 text-center">
              <p className="text-lg font-300 uppercase tracking-[0.2em] text-slate-900">Division</p>
              <div className="mt-0.5 flex min-w-0 items-center justify-center gap-1.5">
                <p className="truncate text-xl font-black text-slate-900 sm:text-2xl">{divisionName || "—"}</p>
              </div>
            </div>
            <div className="justify-self-end shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-600">{divisionRows.length} players</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-xs text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-xs text-rose-500">Failed to load leaderboard.</p>
        ) : rankedRows.length === 0 ? (
          <p className="text-xs text-slate-500">No players in this division.</p>
        ) : (
          rankedRows.map((row) => (
            <LeaderboardPlayerRow
              key={`${divisionId}-${row.entry.displayname ?? row.entry.player}`}
              entry={row.entry}
              idx={row.idx}
              rowKey={`${divisionId}-${row.entry.displayname ?? row.entry.player}`}
              highlightTop3
              displayRank={row.displayRank}
              tieWithNext={row.tieWithNext}
              tieWithPrev={row.tieWithPrev}
              isCurrentUser={row.isCurrentUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
