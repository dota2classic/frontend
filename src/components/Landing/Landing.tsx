import React from "react";

import c from "./Landing.module.scss";
import { EmbedProps, PageLink, TelegramInvite } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import { BlogpostDto, LiveMatchDto } from "@/api/back";
import { RecentPostsCarousel } from "@/components/Landing/RecentPostsCarousel";
import { ProjectStatisticsCarousel } from "@/components/Landing/ProjectStatisticsCarousel";
import { MetaCarousel } from "@/components/Landing/MetaCarousel";

interface Props {
  recentPosts: BlogpostDto[];
  live: LiveMatchDto[];
}

export const Landing = ({ recentPosts }: Props) => {
  return (
    <>
      <EmbedProps
        title={"Играть в старую доту онлайн"}
        description={
          "Dota2Classic это единственный способ поиграть в старую доту из 2015 года. Здесь ты сможешь вспомнить ту самую игру."
        }
      >
        <link rel="canonical" href="https://dotaclassic.ru" />
      </EmbedProps>
      <div className={c.block}>
        <div className={c.promoVideoWrapper}>
          <video
            muted
            loop
            playsInline
            autoPlay
            controls={false}
            src={`/landing/output_action.webm`}
          />
        </div>
        <div className={c.leadingIntent}>
          <h1>
            Скучаешь по <br /> старой доте?
          </h1>
          <p>
            Начни играть в настоящую <span className="gold">Dota 2</span> онлайн
          </p>
          <PageLink
            link={AppRouter.download.link}
            className={c.playButton}
            testId="play-button-main"
          >
            Играть бесплатно
          </PageLink>
        </div>
      </div>
      <RecentPostsCarousel recentPosts={recentPosts} />
      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <img
            className={c.backimage}
            src="/landing/highres2.webp"
            width={1920}
            height={1080}
            alt="123"
          />
        </div>
        <div className={c.leadingIntent}>
          <h2>
            Попробуй оригинальную <br /> игру на вкус
          </h2>
          <p>
            Тысячи игроков предпочитают играть в{" "}
            <span className="red">Dota 2</span> на сайте dotaclassic.ru
          </p>
          <TelegramInvite className={cx(c.playButton, c.telegram)} />
        </div>
      </div>
      <ProjectStatisticsCarousel />
      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <img
            className={c.backimage}
            src="/landing/dotaold.webp"
            width={1920}
            height={1080}
            alt="123"
          />
        </div>
        <div className={c.leadingIntent}>
          <h2>Игра, с которой все начиналось</h2>
          <p>
            Старая карта, оригинальные герои и способности, адекватное
            количество здоровья у героев
          </p>
        </div>
      </div>
      <MetaCarousel />

      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <img
            className={c.backimage}
            src="/landing/bg3.webp"
            width={1920}
            height={1080}
            alt="123"
          />
        </div>
        <div className={cx(c.playBottom)}>
          <PageLink link={AppRouter.download.link} className={cx(c.playButton)}>
            Играть бесплатно
          </PageLink>
        </div>
      </div>
    </>
  );
};
