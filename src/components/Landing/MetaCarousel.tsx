import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import { Carousel, CarouselItem } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

export const MetaCarousel = () => {
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>Статистика</header>
      </div>
      <Carousel>
        <CarouselItem
          link={AppRouter.players.leaderboard().link}
          title="Лучшие игроки"
          image="/landing/leaderboard.webp"
        />
        <CarouselItem
          link={AppRouter.matches.index().link}
          title="История матчей"
          image={"/landing/wallpaper-heroes.webp"}
        />
        <CarouselItem
          link={AppRouter.heroes.index.link}
          title="Сильнейшие герои"
          image={"/landing/invoker.webp"}
        />
      </Carousel>
    </div>
  );
};
