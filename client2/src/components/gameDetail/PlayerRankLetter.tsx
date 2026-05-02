import { btPlayerStats } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import RatingConfig from "@/actions/ratingconfig";

export function PlayerRankLetter({ gameSlug, className }: { gameSlug: string; className?: string }) {
    const playerStats = useBucket(btPlayerStats) as Record<string, any>;
    const rating = Number(playerStats?.[gameSlug]?.rating ?? 0);
    const rankLetter = rating > 0 ? RatingConfig.ratingToRank(rating) : "—";
    return <span className={className}>{rankLetter}</span>;
}
