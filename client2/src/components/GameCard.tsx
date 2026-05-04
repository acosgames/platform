import { Link } from "react-router";
import type { Game } from "../data/mockData";
import { btGames } from "@/actions/buckets";
import { useBucketSelector } from "@/actions/bucket";
import config from "../config";

interface GameCardProps {
  game_slug: string;
}

function formatPlayerCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function GameCard({ game_slug }: GameCardProps) {

    let game:GameInfo = useBucketSelector(btGames,  (games: Record<string, GameInfo>) => games[game_slug]);
    let imgUrl = `${config.https.cdn}g/${game.game_slug}/preview/${game.preview_images}`;

    let playerCount = 0; // TODO: get real player count
  return (
    <Link to={`/game/${game.game_slug}`} className="group block cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl border-2  border-white/10 transition-colors duration-200">
        <img
          src={imgUrl}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Subtle dark scrim */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}

        {/* Players online badge */}
        {playerCount > 0 ?<div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/80">{formatPlayerCount(playerCount)}</span>
        </div> : null}
      </div>

      {/* Name + tags below image */}
      <div className="mt-2.5 px-0.5 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug truncate">{game.name}</h3>
        {/* <div className="flex gap-1 shrink-0 mt-0.5">
          {game.genre.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              {tag}
            </span>
          ))}
        </div> */}
      </div>
    </Link>
  );
}
