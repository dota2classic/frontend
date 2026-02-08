import React, { useMemo } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { DotaGameRulesState } from "@/api/mapped-models";
import c from "./PlayingNowCarousel.module.scss";
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
import { shuffle } from "@/util/shuffle";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const PlayingNowCarousel: React.FC = observer(() => {
  const { live } = useStore();
  const { t } = useTranslation();

  const suitableMatches = useMemo(() => {
    const base = live.liveMatches
      .filter((t) => t.gameState >= DotaGameRulesState.PRE_GAME)
      .sort(
        (a, b) =>
          getLobbyTypePriority(a.matchmakingMode) -
          getLobbyTypePriority(b.matchmakingMode),
      )
      .flatMap((match) =>
        match.heroes.map((hero) => ({
          match,
          hero,
        })),
      )
      .filter((t) => t.hero.user.steamId.length > 2 && t.hero.heroData);
    return shuffle(base);
  }, [live.liveMatches]);

  if (!suitableMatches) return null;
  return (
    <QueuePageBlock title={t("queue_page.section.playing_now")}>
      <AutoCarousel interval={5000}>
        {suitableMatches
          .map(({ match, hero }) => {
            const heroData = hero.heroData!;

            return (
              <div key={match.matchId} className={c.item}>
                <div className={c.player}>
                  <UserPreview avatarSize={40} user={hero.user}>
                    <span>
                      {t(
                        `matchmaking_mode.${match.matchmakingMode}` as TranslationKey,
                      )}
                      , <LivePlayerMmr steamId={hero.user.steamId} />{" "}
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
                  link={AppRouter.matches.match(match.matchId).link}
                  className={cx(c.watchLive, "link")}
                >
                  {t("queue_page.section.watchMatch", { id: match.matchId })}
                </PageLink>
              </div>
            );
          })
          .filter(Boolean)}
      </AutoCarousel>
    </QueuePageBlock>
  );
});
