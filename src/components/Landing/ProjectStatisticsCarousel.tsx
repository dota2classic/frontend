import { Carousel, CarouselItem } from "@/components";
import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import React from "react";
import { useTranslation } from "react-i18next";

export const ProjectStatisticsCarousel = () => {
  const { t } = useTranslation();

  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>{t("project_statistics.header")}</header>
      </div>

      <Carousel>
        <CarouselItem
          image="/landing/leaderboard.webp"
          title={
            <>
              <span className="gold">
                {t("project_statistics.matchesCount")}
              </span>{" "}
              {t("project_statistics.playedMatches")}
            </>
          }
          description={<>{t("project_statistics.matchesDetails")}</>}
        />
        <CarouselItem
          image="/landing/meeponegeroi.webp"
          title={
            <>
              <span className="gold">
                {t("project_statistics.uniquePlayersCount")}
              </span>{" "}
              {t("project_statistics.uniquePlayers")}
            </>
          }
          description={<>{t("project_statistics.contentCreators")}</>}
        />

        <CarouselItem
          image="/landing/profile.jpeg"
          title={
            <>
              <span className="gold">
                {t("project_statistics.gameTimeCount")}
              </span>{" "}
              {t("project_statistics.gameTime")}
            </>
          }
          description={<>{t("project_statistics.nostalgiaExperience")}</>}
        />
      </Carousel>
    </div>
  );
};
