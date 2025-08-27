import { AchievementKey } from "@/api/mapped-models";

export const AchievementMapping: Partial<
  Record<AchievementKey, { img: string; description: string; title: string }>
> = {
  [AchievementKey.WIN_1HR_GAME_AGAINST_TECHIES]: {
    img: "/achievement/Proximity_Mines_icon.webp",
    description: "achievement.win1hrGameAgainstTechies.description",
    title: "achievement.win1hrGameAgainstTechies.title",
  },
  [AchievementKey.LAST_HITS_1000]: {
    img: "/achievement/furion.jpg",
    description: "achievement.lastHits1000.description",
    title: "achievement.lastHits1000.title",
  },
  [AchievementKey.GPM_1000]: {
    img: "/achievement/greed.webp",
    description: "achievement.gpm1000.description",
    title: "achievement.gpm1000.title",
  },
  [AchievementKey.XPM_1000]: {
    img: "/achievement/tome.jpeg",
    description: "achievement.xpm1000.description",
    title: "achievement.xpm1000.title",
  },
  [AchievementKey.ALL_HERO_CHALLENGE]: {
    img: "/achievement/allhero.jpg",
    description: "achievement.allHeroChallenge.description",
    title: "achievement.allHeroChallenge.title",
  },
  [AchievementKey.WIN_BOT_GAME]: {
    img: "/achievement/bots.webp",
    description: "achievement.winBotGame.description",
    title: "achievement.winBotGame.title",
  },
  [AchievementKey.WIN_SOLOMID_GAME]: {
    img: "/achievement/solomid.png",
    description: "achievement.winSoloMidGame.description",
    title: "achievement.winSoloMidGame.title",
  },
  [AchievementKey.GPM_XPM_1000]: {
    img: "/achievement/midas.webp",
    description: "achievement.gpmXpm1000.description",
    title: "achievement.gpmXpm1000.title",
  },
  [AchievementKey.WIN_1HR_GAME]: {
    img: "/achievement/time.webp",
    description: "achievement.win1hrGame.description",
    title: "achievement.win1hrGame.title",
  },
  [AchievementKey.WINSTREAK_10]: {
    img: "/achievement/demetori.png",
    description: "achievement.winStreak10.description",
    title: "achievement.winStreak10.title",
  },
  [AchievementKey.HARDCORE]: {
    img: "/achievement/hardcore.jpeg",
    description: "achievement.hardcore.description",
    title: "achievement.hardcore.title",
  },
  [AchievementKey.DENIES_50]: {
    img: "/achievement/dendi.jpeg",
    description: "achievement.denies50.description",
    title: "achievement.denies50.title",
  },
};
