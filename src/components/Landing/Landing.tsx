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
import { TelegramInvite } from "../TelegramInvite";
import { SrcSetImage } from "@/components/Landing/SrcSetImage";
import { CountUp } from "@/components/CountUp";
import { Button } from "@/components/Button";
import { Surface } from "@/components/Surface";

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
      <div className={c.page}>
        <div className={cx(c.block, c.heroBlock)}>
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
            <Surface
              className={cx(c.overlayCard, c.heroCard)}
              padding="lg"
              variant="panel"
            >
              <span className={c.eyebrow}>Classic Dota</span>
              <h1>{t("landing.oldDota.question")}</h1>
              <h3>
                {t("landing.oldDota.startPlaying", { game: t("game.dota2") })}
              </h3>
              <p className={c.heroStatLine}>
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
              </p>
              <Button
                mega
                className={c.ctaButton}
                pageLink={AppRouter.download.link}
              >
                {t("landing.playForFree")}
              </Button>
            </Surface>
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
            <Surface className={c.overlayCard} padding="lg" variant="panel">
              <span className={c.eyebrow}>Community</span>
              <h2>{t("landing.originalGame.experience")}</h2>
              <p>
                {t("landing.thousandsPlayers", {
                  game: t("game.dota2"),
                  website: "dotaclassic.ru",
                })}
              </p>
              <TelegramInvite className={cx(c.telegram)} />
            </Surface>
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
            <Surface className={c.overlayCard} padding="lg" variant="panel">
              <span className={c.eyebrow}>Meta</span>
              <h2>{t("landing.startingGame")}</h2>
              <p>{t("landing.oldMap.originalHeroes")}</p>
            </Surface>
          </div>
        </div>
        <MetaCarousel />

        <div className={cx(c.block, c.finalBlock)}>
          <div className={c.promoVideoWrapper}>
            <SrcSetImage
              className={c.backimage}
              src="/landing/bg3.webp"
              loading={"lazy"}
            />
          </div>
          <div className={cx(c.leadingIntent)}>
            <Surface className={c.overlayCard} padding="lg" variant="panel">
              <span className={c.eyebrow}>Start Now</span>
              <h2>{t("landing.join")}</h2>
              <Button
                mega
                className={c.ctaButton}
                pageLink={AppRouter.download.link}
              >
                {t("landing.playForFree")}
              </Button>
            </Surface>
          </div>
        </div>
      </div>
    </>
  );
});
