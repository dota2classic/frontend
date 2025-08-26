import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import { Carousel, CarouselItem } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { useTranslation } from "react-i18next";

export const MetaCarousel = () => {
  const { t } = useTranslation();

  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>{t("meta_carousel.statistics")}</header>
      </div>
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
    </div>
  );
};
