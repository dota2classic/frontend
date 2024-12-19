import React from "react";

import c from "./AchievementStatus.module.scss";
import { AchievementDto, AchievementKey } from "@/api/back";
import cx from "clsx";
import { FaCheck } from "react-icons/fa6";
import { RiCloseFill } from "react-icons/ri";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import Image from "next/image";

interface IAchievementStatusProps {
  achievement: AchievementDto;
}

const keyMap: Partial<
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

export const AchievementStatus: React.FC<IAchievementStatusProps> = ({
  achievement,
}) => {
  const main = (
    <div
      className={cx(
        c.achievement,
        !achievement.isComplete && c.achievement__incomplete,
        !achievement.isComplete && c.achievementItem,
      )}
    >
      <Image
        width={100}
        height={100}
        src={keyMap[achievement.key]?.img || "/avatar.png"}
        alt=""
      />
      {achievement.maxProgress === 1 ? (
        <div className={c.progress}>
          {achievement.isComplete ? <FaCheck /> : <RiCloseFill />}
        </div>
      ) : (
        <div className={c.progress}>
          {achievement.progress} / {achievement.maxProgress}
        </div>
      )}
      <div className={c.title}>
        {keyMap[achievement.key]?.title || "TODO title"}
      </div>
      <div className={c.achievementDescription}>
        {keyMap[achievement.key]?.description || "TODO description"}
      </div>
    </div>
  );

  return achievement.isComplete ? (
    <PageLink
      link={AppRouter.matches.match(achievement.match!.id).link}
      className={c.achievementItem}
    >
      {main}
    </PageLink>
  ) : (
    main
  );
};
