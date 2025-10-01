import { AchievementKey } from "@/api/mapped-models";
import { TranslationKey } from "@/TranslationKey";
import cx from "clsx";
import c from "@/components/AchievementStatus/AchievementStatus.module.scss";
import React from "react";

export function formatBigNumber(num: number): string {
  if (num >= 1_000_000) {
    // use "KK" for millions
    return (num / 1_000_000).toFixed(0) + "M";
  } else if (num >= 100_000) {
    // use "K" for thousands
    return (num / 1_000).toFixed(0) + "K";
  } else {
    // normal locale formatting
    return num.toLocaleString();
  }
}

export const prepareAchievementProgress = (
  checkpoints: number[],
  progress: number,
) => {
  return (
    <>
      {checkpoints.map((cp) => (
        <span key={cp} className={cx(progress >= cp && c.complete, c.sep)}>
          {formatBigNumber(cp)}
        </span>
      ))}
    </>
  );
};

export const AchievementMapping: Partial<
  Record<
    AchievementKey,
    { img: string; description: TranslationKey; title: TranslationKey }
  >
> = {
  [AchievementKey.WIN_1HR_GAME_AGAINST_TECHIES]: {
    img: "/achievement2/techies_1.webp",
    description: "achievement.win1hrGameAgainstTechies.description",
    title: "achievement.win1hrGameAgainstTechies.title",
  },
  [AchievementKey.LAST_HITS_1000]: {
    img: "/achievement2/fura_1.webp",
    description: "achievement.lastHits1000.description",
    title: "achievement.lastHits1000.title",
  },
  [AchievementKey.GPM_1000]: {
    img: "/achievement2/greed_1.webp",
    description: "achievement.gpm1000.description",
    title: "achievement.gpm1000.title",
  },
  [AchievementKey.XPM_1000]: {
    img: "/achievement2/tome_1.webp",
    description: "achievement.xpm1000.description",
    title: "achievement.xpm1000.title",
  },
  [AchievementKey.ALL_HERO_CHALLENGE]: {
    img: "/achievement2/universal_1.webp",
    description: "achievement.allHeroChallenge.description",
    title: "achievement.allHeroChallenge.title",
  },
  [AchievementKey.WIN_BOT_GAME]: {
    img: "/achievement2/classic_1.webp",
    description: "achievement.winBotGame.description",
    title: "achievement.winBotGame.title",
  },
  [AchievementKey.WIN_SOLOMID_GAME]: {
    img: "/achievement2/raze_1.webp",
    description: "achievement.winSoloMidGame.description",
    title: "achievement.winSoloMidGame.title",
  },
  [AchievementKey.GPM_XPM_1000]: {
    img: "/achievement2/midas.webp",
    description: "achievement.gpmXpm1000.description",
    title: "achievement.gpmXpm1000.title",
  },
  [AchievementKey.WIN_1HR_GAME]: {
    img: "/achievement2/wd_1.webp",
    description: "achievement.win1hrGame.description",
    title: "achievement.win1hrGame.title",
  },
  [AchievementKey.WINSTREAK_10]: {
    img: "/achievement2/streak_1.webp",
    description: "achievement.winStreak10.description",
    title: "achievement.winStreak10.title",
  },
  [AchievementKey.HARDCORE]: {
    img: "/achievement2/hardcore_2.webp",
    description: "achievement.hardcore.description",
    title: "achievement.hardcore.title",
  },
  [AchievementKey.DENIES_50]: {
    img: "/achievement2/dendi_1.webp",
    description: "achievement.denies50.description",
    title: "achievement.denies50.title",
  },
  [AchievementKey.KILLS]: {
    img: "/achievement2/necr_1.webp",
    description: "achievement.kills.description",
    title: "achievement.kills.title",
  },
  [AchievementKey.ASSISTS]: {
    img: "/achievement2/assist_1.webp",
    description: "achievement.assists.description",
    title: "achievement.assists.title",
  },
  [AchievementKey.MEAT_GRINDER]: {
    img: "/achievement2/meat_1.webp",
    description: "achievement.meatgrinder.description",
    title: "achievement.meatgrinder.title",
  },
  [AchievementKey.MAX_KILLS]: {
    img: "/achievement2/kills_1.webp",
    description: "achievement.maxKills.description",
    title: "achievement.maxKills.title",
  },
  [AchievementKey.MAX_ASSISTS]: {
    img: "/achievement2/zeus-1.webp",
    description: "achievement.maxAssists.description",
    title: "achievement.maxAssists.title",
  },
  [AchievementKey.GLASSCANNON]: {
    img: "/achievement2/sniper_1.webp",
    description: "achievement.glasscannon.description",
    title: "achievement.glasscannon.title",
  },
  [AchievementKey.LAST_HITS_SUM]: {
    img: "/achievement2/raze_1.webp",
    description: "achievement.lastHitsSum.description",
    title: "achievement.lastHitsSum.title",
  },
  [AchievementKey.DENY_SUM]: {
    img: "/achievement2/deny_1.webp",
    description: "achievement.denySum.description",
    title: "achievement.denySum.title",
  },
  [AchievementKey.WIN_UNRANKED_GAME]: {
    img: "/achievement2/flag_2.webp",
    description: "achievement.winUnranked.description",
    title: "achievement.winUnranked.title",
  },
  [AchievementKey.TOWER_DAMAGE]: {
    img: "/achievement2/tower_1.webp",
    description: "achievement.towerDamage.description",
    title: "achievement.towerDamage.title",
  },
  [AchievementKey.TOWER_DAMAGE_SUM]: {
    img: "/achievement2/tower_2.webp",
    description: "achievement.towerDamageSum.description",
    title: "achievement.towerDamageSum.title",
  },
  [AchievementKey.HERO_HEALING]: {
    img: "/achievement2/heal_1.webp",
    description: "achievement.heroHealing.description",
    title: "achievement.heroHealing.title",
  },
  [AchievementKey.HERO_HEALING_SUM]: {
    img: "/achievement2/heal_2.webp",
    description: "achievement.heroHealingSum.description",
    title: "achievement.heroHealingSum.title",
  },
  [AchievementKey.ALL_MELEE]: {
    img: "/achievement2/melee_2.webp",
    description: "achievement.allMelee.description",
    title: "achievement.allMelee.title",
  },
  [AchievementKey.HERO_DAMAGE]: {
    img: "/achievement2/hero_dmg_1.webp",
    description: "achievement.heroDamage.description",
    title: "achievement.heroDamage.title",
  },
  [AchievementKey.HERO_DAMAGE_SUM]: {
    img: "/achievement2/hero_dmg_2.webp",
    description: "achievement.heroDamageSum.description",
    title: "achievement.heroDamageSum.title",
  },
  [AchievementKey.MISSES]: {
    img: "/achievement2/blind_1.webp",
    description: "achievement.misses.description",
    title: "achievement.misses.title",
  },
  [AchievementKey.DEATH_SUM]: {
    img: "/achievement2/leoric_1.webp",
    description: "achievement.deathSum.description",
    title: "achievement.deathSum.title",
  },
};
