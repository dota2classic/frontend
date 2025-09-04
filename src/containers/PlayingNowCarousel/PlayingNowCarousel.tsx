import React, { useMemo } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { DotaGameRulesState } from "@/api/mapped-models";
import c from "./PlayingNowCarousel.module.scss";
import { MatchSlotInfo } from "@/api/back";
import cx from "clsx";
import { AppRouter } from "@/route";
import { LivePlayerMmr } from "@/containers/PlayingNowCarousel/LivePlayerMmr";
import { useTranslation } from "react-i18next";
import { ItemIcon } from "@/components/ItemIcon";
import { PageLink } from "@/components/PageLink";
import { KDABarChart } from "@/components/BarChart";
import { HeroIcon } from "@/components/HeroIcon";
import { UserPreview } from "@/components/UserPreview";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { TranslationKey } from "@/TranslationKey";
import { AutoCarousel } from "@/components/AutoCarousel/AutoCarousel";

const playerPriority = (a: MatchSlotInfo) =>
  a.heroData
    ? (a.heroData!.kills + a.heroData!.assists) / Math.max(a.heroData!.deaths)
    : 0;

export const PlayingNowCarousel: React.FC = observer(() => {
  const { live } = useStore();
  const { t } = useTranslation();

  const suitableMatches = useMemo(
    () =>
      live.liveMatches
        .filter((t) => t.gameState >= DotaGameRulesState.PRE_GAME)
        .sort(
          (a, b) =>
            getLobbyTypePriority(a.matchmakingMode) -
            getLobbyTypePriority(b.matchmakingMode),
        ),
    [live.liveMatches],
  );

  if (!suitableMatches.length) return null;

  return (
    <>
      <header>{t("queue_page.fun.playing_now")}</header>
      <AutoCarousel interval={5000}>
        {suitableMatches
          .map((live) => {
            const bestPlayer = live.heroes
              .slice()
              .filter((t) => t.user.steamId.length > 2 && t.heroData)
              .sort((a, b) => playerPriority(b) - playerPriority(a))[0];

            if (!bestPlayer) return null;
            const heroData = bestPlayer.heroData!;

            return (
              <div key={live.matchId} className={c.item}>
                <div className={c.player}>
                  <UserPreview avatarSize={40} user={bestPlayer.user}>
                    <span>
                      {t(
                        `matchmaking_mode.${live.matchmakingMode}` as TranslationKey,
                      )}
                      , <LivePlayerMmr steamId={bestPlayer.user.steamId} />{" "}
                      {t("common.mmr")}
                    </span>
                  </UserPreview>
                </div>
                <div className={c.hero}>
                  <div className={c.heroInMatch}>
                    <HeroIcon hero={heroData.hero} />
                    <div className={c.kda}>
                      <span>
                        {heroData.kills} / {heroData.deaths} /{" "}
                        {heroData.assists}
                      </span>
                      <KDABarChart
                        assists={heroData.assists}
                        deaths={heroData.deaths}
                        kills={heroData.kills}
                      />
                    </div>
                  </div>
                  <div className={cx(c.heroInMatch, c.items)}>
                    <ItemIcon small item={heroData.item0} />
                    <ItemIcon small item={heroData.item1} />
                    <ItemIcon small item={heroData.item2} />
                    <ItemIcon small item={heroData.item3} />
                    <ItemIcon small item={heroData.item4} />
                    <ItemIcon small item={heroData.item5} />
                  </div>
                </div>
                <PageLink
                  link={AppRouter.matches.match(live.matchId).link}
                  className={cx(c.watchLive, "link")}
                >
                  Смотреть матч {live.matchId}
                </PageLink>
              </div>
            );
          })
          .filter(Boolean)}
      </AutoCarousel>
    </>
  );
});
