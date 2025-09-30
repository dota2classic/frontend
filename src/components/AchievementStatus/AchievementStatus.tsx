import React, { useMemo } from "react";

import c from "./AchievementStatus.module.scss";
import { AchievementDto } from "@/api/back";
import cx from "clsx";
import { AppRouter } from "@/route";
import Image from "next/image";
import {
  AchievementMapping,
  formatBigNumber,
  prepareAchievementProgress,
} from "./achievement-mapping";
import { Trans, useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";
import { Tooltipable } from "@/components/Tooltipable";
import { IoStar } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { RiCloseFill } from "react-icons/ri";
import { TranslationKey } from "@/TranslationKey";

interface IAchievementStatusProps {
  achievement: AchievementDto;
}

export const AchievementStatus: React.FC<IAchievementStatusProps> = ({
  achievement,
}) => {
  const { t } = useTranslation();

  const checkpointLocations = useMemo(() => {
    const cnt = 25;
    const pool = achievement.checkpoints;
    const offset = -(pool.length / 2.5);
    return pool.map((threshold, i) => {
      const angle = ((Math.PI * 2) / cnt) * (i + offset) - Math.PI / 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        complete: achievement.progress >= threshold,
      };
    });
  }, [achievement]);

  const closestCheckpoint = useMemo(() => {
    for (let i = 0; i < achievement.checkpoints.length; i++) {
      if (achievement.progress < achievement.checkpoints[i]) {
        return achievement.checkpoints[i];
      }
    }
    return null;
  }, [achievement]);

  const hasAnyProgress = useMemo(() => {
    return (
      achievement.checkpoints.findIndex((t) => achievement.progress >= t) !== -1
    );
  }, [achievement]);

  const unique =
    achievement.checkpoints.length === 1 && achievement.checkpoints[0] === 1;

  const descriptionKey: string =
    (AchievementMapping[achievement.key]?.description as TranslationKey) ||
    "achievementStatus.defaultDescription";

  const main = (
    <Tooltipable
      className={cx(
        c.achievement,
        !hasAnyProgress && c.achievement__incomplete,
      )}
      tooltip={
        <>
          <Trans
            i18nKey={descriptionKey}
            components={{
              cp: prepareAchievementProgress(
                achievement.checkpoints,
                achievement.progress,
              ),
            }}
          />
          <div className={c.percentile}>
            <Trans
              i18nKey={
                unique
                  ? "achievement.percentileUnique"
                  : "achievement.percentile"
              }
              components={{
                percent: (
                  <span className="gold">
                    {(achievement.percentile * 100).toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </span>
                ),
              }}
            />
          </div>
        </>
      }
    >
      <div>
        <Image
          width={100}
          height={100}
          src={AchievementMapping[achievement.key]?.img || "/avatar.png"}
          alt=""
        />
        <div className={c.stars}>
          {checkpointLocations.map((cp, idx) => {
            // wave formula: peak in the middle
            const middle = (checkpointLocations.length - 1) / 2;
            const offset = Math.abs(idx - middle);

            // higher "offset" => lower translation
            const translateY = -((middle - offset) * 1.5); // tweak multiplier for intensity

            return (
              <span
                key={cp.x}
                style={{
                  transform: `translateY(${translateY}px)`,
                }}
                className={cx(c.star, cp.complete && c.star__complete)}
              >
                <IoStar size={"10px"} />
              </span>
            );
          })}
        </div>
        <div className={c.title}>
          {t(
            AchievementMapping[achievement.key]?.title ||
              "achievementStatus.defaultTitle",
          )}
        </div>
        {unique ? (
          <div className={c.achievementDescription}>
            {achievement.isComplete ? <FaCheck /> : <RiCloseFill />}
          </div>
        ) : (
          <div className={c.achievementDescription}>
            {closestCheckpoint
              ? `${formatBigNumber(achievement.progress)} / ${formatBigNumber(closestCheckpoint)}`
              : `${formatBigNumber(achievement.progress)}`}
          </div>
        )}
      </div>
    </Tooltipable>
  );

  return achievement.matchId ? (
    <PageLink
      link={AppRouter.matches.match(achievement.matchId).link}
      className={c.achievementItem}
    >
      {main}
    </PageLink>
  ) : (
    main
  );
};
