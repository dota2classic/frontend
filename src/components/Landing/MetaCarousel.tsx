import { AppRouter } from "@/route";
import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../Carousel";
import { CarouselItem } from "../CarouselItem";
import { LandingCarouselBlock } from "./LandingCarouselBlock";

export const MetaCarousel = () => {
  const { t } = useTranslation();

  return (
    <LandingCarouselBlock title={t("meta_carousel.statistics")}>
      <Carousel>
        <CarouselItem
          link={AppRouter.players.leaderboard().link}
          title={t("meta_carousel.bestPlayers")}
          image="/landing/leaderboard.webp"
        />
        <CarouselItem
          link={AppRouter.matches.index().link}
          title={t("meta_carousel.matchHistory")}
          image={"/landing/wallpaper-heroes.webp"}
        />
        <CarouselItem
          link={AppRouter.heroes.index.link}
          title={t("meta_carousel.strongestHeroes")}
          image={"/landing/invoker.webp"}
        />
      </Carousel>
    </LandingCarouselBlock>
  );
};
