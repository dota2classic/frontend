import React from "react";

import c from "./AchievementStatus.module.scss";
import { AchievementDto } from "@/api/back";
import cx from "clsx";
import { FaCheck } from "react-icons/fa6";
import { RiCloseFill } from "react-icons/ri";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import Image from "next/image";
import { AchievementMapping } from "@/components/AchievementStatus/achievement-mapping";

interface IAchievementStatusProps {
  achievement: AchievementDto;
}

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
        src={AchievementMapping[achievement.key]?.img || "/avatar.png"}
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
        {AchievementMapping[achievement.key]?.title || "TODO title"}
      </div>
      <div className={c.achievementDescription}>
        {AchievementMapping[achievement.key]?.description || "TODO description"}
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
