import { Carousel, CarouselItem } from "@/components";
import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import React from "react";

export const ProjectStatisticsCarousel = () => {
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>Статистика</header>
      </div>

      <Carousel>
        <CarouselItem
          image="/landing/leaderboard.jpg"
          title={
            <>
              <span className="gold">Более 22,000</span> сыгранных матчей
            </>
          }
          description={
            <>
              Из них более 13400 в режиме 5х5, 5000 игр в обучение, 3100 в
              режиме 1х1
            </>
          }
        />
        <CarouselItem
          image="/landing/meeponegeroi.jpg"
          title={
            <>
              <span className="gold">15,000+</span> уникальных игроков
            </>
          }
          description={
            <>
              В наш проект так же играли контент мейкеры meeponegeroi, INBossik
              и многие другие
            </>
          }
        />

        <CarouselItem
          image="/landing/profile.jpeg"
          title={
            <>
              <span className="gold">87,480 часов</span> игрового времени
            </>
          }
          description={
            <>
              Мы стараемся, чтобы каждый мог окунуться в ностальгию, либо же
              попробовать впервые оригинальную версию игры
            </>
          }
        />
      </Carousel>
    </div>
  );
};
