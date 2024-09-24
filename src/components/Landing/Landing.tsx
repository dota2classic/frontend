import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import c from "./Landing.module.scss";
import { Duration, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "classnames";
import Image from "next/image";
import Head from "next/head";

export const Landing = () => {
  useEffect(() => {
    if (typeof window !== "undefined") AOS.init();
  }, []);
  return (
    <>
      <Head>
        <title>Dota2Classic - играть в старую доту онлайн</title>
        <meta
          name="description"
          content={
            "Dota2Classic это единственный способ поиграть в старую доту из 2015 года. Здесь ты сможешь вспомнить ту самую игру."
          }
        />
        <link rel="canonical" href="https://dotaclassic.ru" />
      </Head>
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
          <h1>Волшебный мир старой Доты, о котором ты скучал</h1>

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
        <dl className={c.stat}>
          <dd>19 057 матчей</dd>
          <dt>Сыграно за все время</dt>
        </dl>
        <dl className={c.stat}>
          <dd>
            <Duration big duration={35130960} />
          </dd>
          <dt>Общая длительность матчей</dt>
        </dl>
        <dl className={c.stat}>
          <dd>5 лет</dd>
          <dt>Существует проект</dt>
        </dl>
        <dl className={c.stat}>
          <dd>8 турниров</dd>
          <dt>С призовыми более миллиона ₽</dt>
        </dl>
        <dl className={c.stat}>
          <dd>14 160</dd>
          <dt>Уникальных игроков</dt>
        </dl>
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
