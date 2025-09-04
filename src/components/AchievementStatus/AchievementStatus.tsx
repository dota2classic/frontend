import React from "react";

import c from "./AchievementStatus.module.scss";
import { AchievementDto } from "@/api/back";
import cx from "clsx";
import { FaCheck } from "react-icons/fa6";
import { RiCloseFill } from "react-icons/ri";
import { AppRouter } from "@/route";
import Image from "next/image";
import { AchievementMapping } from "./achievement-mapping";
import { useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";

interface IAchievementStatusProps {
  achievement: AchievementDto;
}

export const AchievementStatus: React.FC<IAchievementStatusProps> = ({
  achievement,
}) => {
  const { t } = useTranslation();

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
        {t(
          AchievementMapping[achievement.key]?.title ||
            "achievementStatus.defaultTitle",
        )}
      </div>
      <div className={c.achievementDescription}>
        {t(
          AchievementMapping[achievement.key]?.description ||
            "achievementStatus.defaultDescription",
        )}
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
