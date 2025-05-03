import { AchievementKey } from "@/api/mapped-models";

export const AchievementMapping: Partial<
  Record<AchievementKey, { img: string; description: string; title: string }>
> = {
  [AchievementKey.WIN_1HR_GAME_AGAINST_TECHIES]: {
    img: "/achievement/Proximity_Mines_icon.webp",
    description: "Выиграть часовую игру против Techies",
    title: "Терпила",
  },
  [AchievementKey.LAST_HITS_1000]: {
    img: "/achievement/furion.jpg",
    description: "Добить 1000 вражеских крипов",
    title: "Крипочек",
  },
  [AchievementKey.GPM_1000]: {
    img: "/achievement/greed.webp",
    description: "Закончить игру с 1000 золота в минуту",
    title: "Бизнесмен",
  },
  [AchievementKey.XPM_1000]: {
    img: "/achievement/tome.jpeg",
    description: "Закончить игру с 1000 опыта в минуту",
    title: "На опыте",
  },
  [AchievementKey.ALL_HERO_CHALLENGE]: {
    img: "/achievement/allhero.jpg",
    description: "Победить на каждом герое",
    title: "Универсал",
  },
  [AchievementKey.WIN_BOT_GAME]: {
    img: "/achievement/bots.webp",
    description: "Победить против ботов",
    title: "Классиковец",
  },
  [AchievementKey.WIN_SOLOMID_GAME]: {
    img: "/achievement/solomid.png",
    description: "Победить в 1х1",
    title: "sololineabuse",
  },
  [AchievementKey.GPM_XPM_1000]: {
    img: "/achievement/midas.webp",
    description: "Закончить игру с 1000 золота в минуту и 1000 опыта в минуту",
    title: "Бустер",
  },
  [AchievementKey.WIN_1HR_GAME]: {
    img: "/achievement/time.webp",
    description: "Победить часовую игру",
    title: "По фасту",
  },
  [AchievementKey.WINSTREAK_10]: {
    img: "/achievement/demetori.png",
    description: "Победить 10 игр подряд",
    title: "Стрикер",
  },
  [AchievementKey.HARDCORE]: {
    img: "/achievement/hardcore.jpeg",
    description: "Победить игру с 25 уровнем без смертей",
    title: "Харкдор",
  },
  [AchievementKey.DENIES_50]: {
    img: "/achievement/dendi.jpeg",
    description: "Не отдать врагу 50 союзных крипов",
    title: "Денди",
  },
};
