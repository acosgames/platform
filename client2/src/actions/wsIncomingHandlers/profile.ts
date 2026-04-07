import { btExperience, btGame, btUser } from "../buckets";
import type { WSIncomingHandler } from "./types";

export const handleXp: WSIncomingHandler = (context) => {
    console.log("[XP]:", context.msg);
    btExperience.set(context.msg.payload);

    const payload = context.msg.payload as { level?: number; points?: number };
    const level = (payload.level || 0) + (payload.points || 0) / 1000;
    btUser.assign({ level });

    return "return";
};

export const handleAchievements: WSIncomingHandler = (context) => {
    console.log("[Achievements]:", context.msg);

    const achievements = context.msg.payload as Record<string, any>;
    const gameSlug = (context.msg as ACOSMessage & { game_slug?: string }).game_slug;
    const game = btGame.get();

    if (game?.game_slug === gameSlug && Array.isArray(game.achievements)) {
        for (const achievement of game.achievements) {
            const slug = achievement?.achievement_slug;
            if (slug && slug in achievements) {
                Object.assign(achievement, achievements[slug]);
            }
        }
    }

    btGame.assign({ achievements: game?.achievements || [] });
    return "return";
};
