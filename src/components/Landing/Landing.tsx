import React from "react";

import c from "./Landing.module.scss";

import { AppRouter } from "@/route";
import cx from "clsx";
import {
  AggregatedStatsDto,
  BlogpostDto,
  LiveMatchDto,
  TwitchStreamDto,
} from "@/api/back";
import { RecentPostsCarousel } from "./RecentPostsCarousel";
import { ProjectStatisticsCarousel } from "./ProjectStatisticsCarousel";
import { MetaCarousel } from "./MetaCarousel";
import { StreamCarousel } from "./StreamCarousel";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { Trans, useTranslation } from "react-i18next";
import { EmbedProps } from "../EmbedProps";
import { PageLink } from "../PageLink";
import { TelegramInvite } from "../TelegramInvite";
import { SrcSetImage } from "@/components/Landing/SrcSetImage";
import { CountUp } from "@/components/CountUp";

interface Props {
  recentPosts: BlogpostDto[];
  live: LiveMatchDto[];
  aggStats: AggregatedStatsDto;
}

export const Landing = observer(({ recentPosts, aggStats }: Props) => {
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
        <div className={cx(c.leadingIntent)}>
          <h1>{t("landing.oldDota.question")}</h1>
          <h3>
            {t("landing.oldDota.startPlaying", { game: t("game.dota2") })}
          </h3>
          <h4>
            <Trans
              i18nKey={"landing.oldDota.gamesWeekly"}
              count={aggStats.humanGamesWeekly}
              components={{
                games: (
                  <CountUp
                    className="gold"
                    end={aggStats.humanGamesWeekly}
                    duration={1400}
                  />
                ),
              }}
            />
            ,{" "}
            <Trans
              i18nKey={"landing.oldDota.playersWeekly"}
              count={aggStats.playersWeekly}
              components={{
                players: (
                  <CountUp
                    className="gold"
                    end={aggStats.playersWeekly}
                    duration={1400}
                  />
                ),
              }}
            />{" "}
            {t("landing.oldDota.weekly")}
          </h4>
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
        <div className={cx(c.leadingIntent)}>
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
        <div className={cx(c.leadingIntent)}>
          <h2>{t("landing.join")}</h2>
          <PageLink link={AppRouter.download.link} className={cx(c.playButton)}>
            {t("landing.playForFree")}
          </PageLink>
        </div>
      </div>
    </>
  );
});
