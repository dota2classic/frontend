import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../Carousel";
import { CarouselItem } from "../CarouselItem";
import { LandingCarouselBlock } from "./LandingCarouselBlock";

export const ProjectStatisticsCarousel = () => {
  const { t } = useTranslation();

  return (
    <LandingCarouselBlock title={t("project_statistics.header")}>
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
    </LandingCarouselBlock>
  );
};
