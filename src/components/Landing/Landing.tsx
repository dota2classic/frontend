import React from "react";

import c from "./Landing.module.scss";

import { AppRouter } from "@/route";
import cx from "clsx";
import { BlogpostDto, LiveMatchDto, TwitchStreamDto } from "@/api/back";
import { RecentPostsCarousel } from "./RecentPostsCarousel";
import { ProjectStatisticsCarousel } from "./ProjectStatisticsCarousel";
import { MetaCarousel } from "./MetaCarousel";
import { StreamCarousel } from "./StreamCarousel";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "../EmbedProps";
import { PageLink } from "../PageLink";
import { TelegramInvite } from "../TelegramInvite";
import { SrcSetImage } from "@/components/Landing/SrcSetImage";

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
          <SrcSetImage
            fetchPriority="high"
            loading="eager"
            className={c.backimage}
            src="/landing/highres2.webp"
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
          <SrcSetImage
            className={c.backimage}
            loading="lazy"
            src="/landing/dotaold.webp"
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
          <SrcSetImage
            className={c.backimage}
            src="/landing/bg3.webp"
            loading={"lazy"}
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
