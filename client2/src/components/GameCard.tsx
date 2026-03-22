import { Link } from "react-router";
import { useNavigate } from "react-router";
import type { Game } from "../data/mockData";
import { useMatchmakingQueue } from "../context/MatchmakingQueueContext";

interface GameCardProps {
  game: Game;
}

function formatPlayerCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const { enqueue } = useMatchmakingQueue();

  const handleQuickPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    enqueue({ gameId: game.id, gameName: game.name });
    // navigate(`/game/${game.id}/play`);
  };

  return (
    <Link
      to={`/game/${game.id}`}
      className="group relative 
      overflow-hidden cursor-pointer bg-card border border-white/10 hover:border-cyan-500/40 
      transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-102 hover:-translate-z-0.5"
    >
      {/* Background image */}
      <div className="relative h-48 overflow-hidden bg-card">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 "
        />
        {/* Gradient overlay */}
        {/* <div className="absolute z-10 -bottom-px inset-x-0 top-0 bg-linear-to-t from-card via-card/5 to-transparent" /> */}
        {/* Prevent sub-pixel bleed at the image/body seam while scaling on hover */}
        {/* <div className="absolute bottom-0 inset-x-0 h-0.5 bg-card" /> */}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-cyan-400 border border-cyan-500/30">
            {game.category}
          </span>
        </div>

        {/* Players online badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/80">{formatPlayerCount(game.players)} online</span>
        </div>

      

        {/* Game name overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="inline-flex max-w-full text-lg font-bold text-white leading-tight px-2 py-1 rounded-md bg-black/75 backdrop-blur-[1px] border border-white/10">
            <span className="truncate">{game.name}</span>
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 pt-3 pb-4 space-y-2.5">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground truncate">by {game.developer}</span>
          {/* <span className="text-xs text-white/60 whitespace-nowrap">{game.releaseDate}</span> */}
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5">
            {game.genre.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick play */}
          <button
            type="button"
            onClick={handleQuickPlay}
            className="shrink-0 inline-flex items-center gap-2 h-8 px-3 rounded-full text-xs font-semibold tracking-wide text-cyan-100 bg-linear-to-r from-cyan-500/20 via-sky-500/15 to-purple-500/20 border border-cyan-300/40 ring-1 ring-cyan-400/15 hover:from-cyan-400/35 hover:via-sky-400/30 hover:to-purple-400/35 hover:text-white hover:border-cyan-200/60 hover:ring-cyan-300/30 transition-all duration-200 shadow-[0_4px_14px_rgba(0,217,255,0.2)] hover:shadow-[0_8px_22px_rgba(0,217,255,0.35)] active:scale-95"
          >
            <span className="text-[10px] leading-none">▶</span>
            QUICK PLAY
          </button>
        </div>
      </div>
    </Link>
  );
}
