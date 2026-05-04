import { currentPlayer, type LeaderboardEntry } from "../../data/mockData";
import config from "../../config";
import React, { useId } from "react";

function getPortraitUrl(playerName: string, idx: number): string {
  if (playerName === currentPlayer.name) {
    return currentPlayer.avatarUrl;
  }
  return `https://i.pravatar.cc/100?img=${idx + 11}`;
}

function getRecord(wins: number, idx: number) {
  const ties = Math.max(4, Math.round(wins * 0.08) - idx);
  const losses = Math.max(10, Math.round(wins * 0.34) + idx * 3);
  return { ties, losses };
}

const TOP3_RANK: Record<number, { rank: string; name: string; row: string }> = {
  1: {
    rank: "text-slate-900 ",
    name: "text-slate-900 font-black",
    row: "border-amber-200/80 bg-linear-to-r from-amber-300 to-amber-400 hover:from-amber-100",
  },
  2: {
    rank: "text-slate-900 ",
    name: "text-slate-900 font-black",
    row: "border-slate-300/80 bg-linear-to-r from-slate-100 to-slate-300 hover:from-slate-200/80",
  },
  3: {
    rank: "text-slate-900 ",
    name: "text-slate-900 font-black",
    row: "border-orange-200/80 bg-linear-to-r from-orange-200 to-orange-300 hover:from-orange-100",
  },
};

export function LeaderboardPlayerRow({
  entry,
  idx,
  rowKey,
  highlightTop3 = false,
  displayRank,
  tieWithNext = false,
  tieWithPrev = false,
  isCurrentUser = false,
}: {
  entry: LeaderboardEntry;
  idx: number;
  rowKey: string;
  highlightTop3?: boolean;
  displayRank?: number;
  tieWithNext?: boolean;
  tieWithPrev?: boolean;
  isCurrentUser?: boolean;
}) {
  // const { ties, losses } = getRecord(entry.wins, idx);
  const countryCode = entry.countrycode.toUpperCase();
  const flagSrc = `${config.https.cdn}images/country/${countryCode}.svg`;
  const portraitUrl = getPortraitUrl(entry.player, idx);

  const rankValue = displayRank ?? entry.rank;
  const top3Place = highlightTop3 && rankValue <= 3 ? rankValue as 1 | 2 | 3 : null;
  const top3 = top3Place ? TOP3_RANK[top3Place] : null;

  const rowBg = isCurrentUser
    ? "bg-blue-50 ring-2 ring-blue-400 hover:bg-blue-100"
    : idx % 2 === 0
      ? "bg-white hover:bg-blue-100"
      : "bg-slate-100 hover:bg-blue-100";

  const rowClass = rowBg;

  const rankBlockClass = top3
    ? top3.rank
    : " text-slate-900 ";

  const nameClass = top3 ? top3.name : "text-slate-800 font-semibold";


  // SVG mask for half-hole punch effect
  const maskId = useId();
  // Row dimensions (should match actual rendered size)
  const rowWidth = 10000; // px, large enough for leaderboard row
  const rowHeight = 80; // px, approx h-14
  const rankBlockCenter = 24; // px from left (w-12 = 48px, center is 24px)
  const punchRadius = 8; // px, matches h-4 w-4

  // SVG path for slanted right edge
  const basePolygon = `M0,0 L${rowWidth},0 L${rowWidth},${rowHeight} L0,${rowHeight} Z`;

  // SVG mask: white for visible, black for holes
  function renderMask() {
    return (
      <svg width={rowWidth} height={rowHeight} style={{ position: 'absolute', pointerEvents: 'none' }}>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={rowWidth} height={rowHeight} fill="white" />
          {/* Slanted right edge */}
          {/* <path d={basePolygon} fill="black" /> */}
          {/* Punch out circles */}
          {tieWithPrev && (
            <circle cx={rankBlockCenter} cy={0} r={punchRadius} fill="black" />
          )}
          {tieWithNext && (
            <circle cx={rankBlockCenter} cy={rowHeight - 20} r={punchRadius} fill="black" />
          )}
        </mask>
      </svg>
    );
  }

  return (
    <article
      key={rowKey}
      className={`group rounded-md transition-colors ${rowClass} drop-shadow-md relative`}
      style={{
        // mask: `url(#${maskId})`,
        // WebkitMask: `url(#${maskId})`,
        // maskRepeat: 'no-repeat',
        // WebkitMaskRepeat: 'no-repeat',
      }}
    >
      {/* SVG mask definition (hidden, but must be in DOM) */}
      {/* <svg width={0} height={0} style={{ position: 'absolute' }}>{renderMask()}</svg> */}
      <div className="flex items-center justify-between gap-2.5 relative z-2 ">
        <div className="flex relative items-center gap-2.5 min-w-0">
          {/* Top 3 gradient background behind rank, portrait, and name only */}
          {top3 ? (
            <div
              className={`absolute -z-1 left-0 top-0 h-full`}
              style={{
                width: '3.25rem', // covers rank (2.25rem), portrait (3.25rem), and name (3.5rem)
                clipPath: 'polygon(-10px -10px, 100% -10px, 80% 100%, -10px 100%)',
              }}
            >
              <div className={`w-full h-full rounded-l-lg ${top3.row}`} />
            </div>
          ) : null}
          {/* Rank */}
          <div className="relative shrink-0 h-9 w-12 flex justify-center items-center">
            <div className={`h-9 w-9 rounded-full text-xl  font-black flex items-center justify-center ${rankBlockClass}`}>
              {rankValue}
            </div>
          </div>

          {/* Portrait */}
          <div className="relative -left-1 shrink-0 w-13 h-13 p-1 bg-linear-to-br from-slate-500/60 via-slate-500/35 to-slate-700/65 rounded-lg">
            <img
              src={portraitUrl}
              alt={`${entry.displayname} portrait`}
              className="min-w-11 h-11 w-11 rounded-md object-cover transition-transform duration-100 ease-out group-hover:rotate-0"
            />
          </div>

          {/* Name + flag */}
          <div className="min-w-0 py-1.5 sm:py-2">
            <p className={`text-md truncate leading-tight ${nameClass}`}>{entry.displayname}</p>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-slate-100 px-1 py-0.5 max-w-full">
              <img src={flagSrc} alt={`${countryCode} flag`} className="w-4.5 h-3 rounded-[2px] object-cover border border-slate-200 shrink-0" />
              <span className="text-[10px] text-slate-500 truncate">{countryCode}</span>
            </div>
          </div>
        </div>

        {/* Score + record */}
        <div className="shrink-0 text-right leading-tight space-y-1 pr-2.5 sm:pr-3">
          <p className="text-sm font-bold text-primary">{entry.rating}</p>
          <div className="flex items-center gap-0.25 justify-end">
            <span className="text-[10px] font-semibold text-slate-500">{entry.win}</span>
            <span className="text-slate-400 text-[10px]">-</span>
            <span className="text-[10px] font-semibold text-slate-500">{entry.tie}</span>
            <span className="text-slate-400 text-[10px]">-</span>
            <span className="text-[10px] font-semibold text-slate-500">{entry.loss}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

