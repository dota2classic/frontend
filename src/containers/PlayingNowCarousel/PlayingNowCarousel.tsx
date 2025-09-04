import React from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { DotaGameRulesState, MatchmakingMode } from "@/api/mapped-models";
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
import { Panel } from "@/components/Panel";

const playerPriority = (a: MatchSlotInfo) =>
  a.heroData
    ? (a.heroData!.kills + a.heroData!.assists) / Math.max(a.heroData!.deaths)
    : 0;

export const PlayingNowCarousel: React.FC = observer(() => {
  const { live } = useStore();
  const { t } = useTranslation();

  return (
    <Panel className={c.carousel}>
      {live.liveMatches
        .filter(
          (t) =>
            t.matchmakingMode === MatchmakingMode.UNRANKED &&
            t.gameState >= DotaGameRulesState.PRE_GAME,
        )
        .map((live) => {
          const bestPlayer = live.heroes
            .slice()
            .sort((a, b) => playerPriority(b) - playerPriority(a))[0];

          const heroData = bestPlayer.heroData!;

          return (
            <div key={live.matchId} className={c.carouselItem}>
              <div className={c.player}>
                <UserPreview avatarSize={40} user={bestPlayer.user}>
                  <span>
                    <LivePlayerMmr steamId={bestPlayer.user.steamId} />{" "}
                    {t("common.mmr")}
                  </span>
                </UserPreview>
              </div>
              <div className={c.hero}>
                <div className={c.heroInMatch}>
                  <HeroIcon hero={heroData.hero} />
                  <div className={c.kda}>
                    <span>
                      {heroData.kills} / {heroData.deaths} / {heroData.assists}
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
        })}
    </Panel>
  );
});
