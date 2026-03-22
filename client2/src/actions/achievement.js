import { btAchievementAward, btClaimingAchievement, btGame } from "./buckets";
import { POST } from "./http";

export async function claimAchievement(game_slug, achievement_slug) {
    try {
        btClaimingAchievement.set(true);
        let request = await POST("/api/v1/game/achievement/claim", {
            game_slug,
            achievement_slug,
        });
        let response = request.data;

        if (response?.type == "award_xp") {
            let level = response.newLevel;
            btUser.assign({ level });
        }

        btAchievementAward.set(response);
        btClaimingAchievement.set(false);

        let game = btGame.get();
        let achievements = game?.achievements || [];

        for (let achievement of achievements) {
            if (achievement.achievement_slug == achievement_slug) {
                achievement.claimed = 1;
            }
        }

        btGame.assign({ achievements });

        return response;
    } catch (e) {
        btClaimingAchievement.set(false);
        console.error(e);
    }
    return null;
}