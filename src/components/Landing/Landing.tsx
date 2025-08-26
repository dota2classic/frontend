import React from "react";

import c from "./Landing.module.scss";
import { EmbedProps, PageLink, TelegramInvite } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import { BlogpostDto, LiveMatchDto, TwitchStreamDto } from "@/api/back";
import { RecentPostsCarousel } from "@/components/Landing/RecentPostsCarousel";
import { ProjectStatisticsCarousel } from "@/components/Landing/ProjectStatisticsCarousel";
import { MetaCarousel } from "@/components/Landing/MetaCarousel";
import { StreamCarousel } from "@/components/Landing/StreamCarousel";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useTranslation } from "react-i18next";

interface Props {
  recentPosts: BlogpostDto[];
  live: LiveMatchDto[];
}

export const Landing = observer(({ recentPosts }: Props) => {
  const { t } = useTranslation();
  const { live } = useStore();

  const streamList: TwitchStreamDto[] = live.streams;
  return (
    <>
      <EmbedProps
        title={t("landing.embed.title")}
        description={t("landing.embed.description")}
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
          <h1>{t("landing.oldDota.question")}</h1>
          <p>{t("landing.oldDota.startPlaying", { game: t("game.dota2") })}</p>
          <PageLink
            link={AppRouter.download.link}
            className={c.playButton}
            testId="play-button-main"
          >
            {t("landing.playForFree")}
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
            alt="highres"
          />
        </div>
        <div className={c.leadingIntent}>
          <h2>{t("landing.originalGame.experience")}</h2>
          <p>
            {t("landing.thousandsPlayers", {
              game: t("game.dota2"),
              website: "dotaclassic.ru",
            })}
          </p>
          <TelegramInvite className={cx(c.playButton, c.telegram)} />
        </div>
      </div>
      {streamList.length ? (
        <StreamCarousel streamList={streamList} />
      ) : (
        <ProjectStatisticsCarousel />
      )}

      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <img
            className={c.backimage}
            src="/landing/dotaold.webp"
            width={1920}
            height={1080}
            alt="old dota"
          />
        </div>
        <div className={c.leadingIntent}>
          <h2>{t("landing.startingGame")}</h2>
          <p>{t("landing.oldMap.originalHeroes")}</p>
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
            alt="background"
          />
        </div>
        <div className={cx(c.playBottom)}>
          <PageLink link={AppRouter.download.link} className={cx(c.playButton)}>
            {t("landing.playForFree")}
          </PageLink>
        </div>
      </div>
    </>
  );
});
