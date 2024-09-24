import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import c from "./Landing.module.scss";
import { Duration, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "classnames";
import Image from "next/image";

export const Landing = () => {
  useEffect(() => {
    if (typeof window !== "undefined") AOS.init();
  }, []);
  return (
    <>
      <div className={c.block}>
        <div className={c.promoVideoWrapper}>
          <video
            muted
            loop
            autoPlay
            controls={false}
            src={`/landing/d2video.mp4`}
          />
        </div>
        <div
          className={c.leadingIntent}
          data-aos="fade-right"
          data-aos-delay="500"
          data-aos-duration="1500"
        >
          <h2>Волшебный мир старой Доты, о котором ты скучал</h2>

          <PageLink link={AppRouter.index.link} className={c.playButton}>
            Играть бесплатно
          </PageLink>
        </div>
      </div>
      <div
        className={cx(c.carousel__stat, c.carousel)}
        data-aos="fade-up"
        data-aos-delay="0"
        data-aos-duration="1500"
      >
        <div className={c.stat}>
          <h3>19 057 матчей</h3>
          <h4>Сыграно за все время</h4>
        </div>
        <div className={c.stat}>
          <h3>
            <Duration big duration={35130960} />
          </h3>
          <h4>Общая длительность матчей</h4>
        </div>
        <div className={c.stat}>
          <h3>5 лет</h3>
          <h4>Существует проект</h4>
        </div>
        <div className={c.stat}>
          <h3>8 турниров</h3>
          <h4>С призовыми более миллиона ₽</h4>
        </div>
        <div className={c.stat}>
          <h3>14 160</h3>
          <h4>Уникальных игроков</h4>
        </div>
      </div>
      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <Image
            className={c.backimage}
            src="/landing/landing_1.jpg"
            width={1280}
            height={720}
            alt=""
          />
        </div>
        <h3
          className={c.wow}
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-duration="1500"
        >
          <span>Присоединяйся</span>
          <br />
          <div>К тысячам игроков, которые предпочитают настоящую доту</div>
        </h3>
      </div>
      <div
        className={cx(c.block, c.carousel)}
        data-aos="fade-up"
        data-aos-delay="0"
        data-aos-duration="1500"
      >
        <PageLink link={AppRouter.players.leaderboard.link}>
          <h3>Лучшие игроки</h3>
          <Image
            width={380}
            height={245}
            style={{ scale: 1.1 }}
            src="/landing/leaderboard.jpg"
            alt="Leaderboard"
          />
        </PageLink>
        <PageLink link={AppRouter.matches.index().link}>
          <h3>Матчи</h3>
          <Image
            width={380}
            height={245}
            src="/landing/fight.jpg"
            alt="Match history"
          />
        </PageLink>
        <PageLink link={AppRouter.heroes.index.link}>
          <h3>Сильнейшие герои</h3>
          <Image
            width={380}
            height={245}
            src="/landing/invoker.jpg"
            alt="Strongest heroes"
          />
        </PageLink>
      </div>

      <div className={c.block}>
        <h2>Присоединяйся!</h2>
        <br />
        <PageLink link={AppRouter.index.link} className={c.playButton}>
          Играть бесплатно
        </PageLink>
      </div>
    </>
  );
};
