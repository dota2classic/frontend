import {
  AchievementStatus,
  EmbedProps,
  HeroPerformanceTable,
  PageLink,
  Panel,
  PlayerPentagonStats,
  PlayerSummary,
  Section,
} from "@/components";
import c from "./PlayerPage.module.scss";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import {
  AchievementDto,
  HeroStatsDto,
  MatchPageDto,
  PlayerSummaryDto,
  ThreadType,
} from "@/api/back";
import { PlayerMatchItem } from "@/components/HeroWithItemsHistoryTable/HeroWithItemsHistoryTable";
import { matchToPlayerMatchItem } from "@/util/mappers";
import Head from "next/head";
import React from "react";
import { AppRouter } from "@/route";
import { MatchComparator } from "@/util/sorts";
import { LazyPaginatedThread } from "@/containers/Thread/LazyPaginatedThread";

//
interface PlayerPageProps {
  playerId: string;
  preloadedSummary: PlayerSummaryDto;
  preloadedMatches: MatchPageDto;
  preloadedHeroStats: HeroStatsDto[];
  preloadedAchievements: AchievementDto[];
}

export default function PlayerPage({
  playerId,
  preloadedSummary,
  preloadedMatches,
  preloadedHeroStats,
  preloadedAchievements,
}: PlayerPageProps) {
  const formattedMatches: PlayerMatchItem[] = (preloadedMatches?.data || [])
    .sort(MatchComparator)
    .map((it) =>
      matchToPlayerMatchItem(it, (it) => it.user.steamId === playerId),
    );

  const formattedHeroStats = (preloadedHeroStats || [])
    .toSorted((a, b) => b.games - a.games)
    .map((it) => ({
      hero: it.hero,
      kda: it.kda,
      wins: it.wins,
      loss: it.loss,
    }))
    .slice(0, 10);

  return (
    <div className={c.playerPage}>
      <Head>
        <title>{`${preloadedSummary.user.name} - статистика`}</title>
      </Head>
      <EmbedProps
        title={`${preloadedSummary.user.name} - статистика`}
        description={`Профиль и статистика игрока ${preloadedSummary.user.name}`}
        image={preloadedSummary.user.avatar}
      />
      <PlayerSummary
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rank={preloadedSummary.rank}
        mmr={preloadedSummary.mmr}
        image={preloadedSummary.user.avatar || "/avatar.png"}
        name={preloadedSummary.user.name}
        steamId={preloadedSummary.user.steamId}
        lastGameTimestamp={formattedMatches[0]?.timestamp}
      />
      <Section style={{ gridColumn: "span 12" }}>
        <header>Достижения</header>
        <Panel className={c.achievements}>
          {preloadedAchievements
            .sort((a, b) => b.key - a.key)
            .map((t) => (
              <AchievementStatus key={t.key} achievement={t} />
            ))}
        </Panel>
      </Section>
      <Section className={c.matchHistory}>
        <header data-testid="player-hero-performance-header">
          <span>Отзывы игроков</span>
        </header>
        <PlayerPentagonStats
          games={preloadedSummary.gamesPlayed}
          aspects={preloadedSummary.aspects}
          kills={preloadedSummary.kills}
          deaths={preloadedSummary.deaths}
          assists={preloadedSummary.assists}
          playtime={preloadedSummary.playtime}
        />
      </Section>
      <Section className={c.heroPerformance}>
        <header data-testid="player-hero-performance-header">
          <span>Лучшие герои</span>
          <PageLink link={AppRouter.players.player.heroes(playerId).link}>
            Показать всех
          </PageLink>
        </header>
        <HeroPerformanceTable
          steamId={playerId}
          loading={false}
          data={formattedHeroStats}
        />
      </Section>
      <LazyPaginatedThread
        className={c.thread}
        id={playerId}
        threadType={ThreadType.PLAYER}
      />
    </div>
  );
}

PlayerPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<PlayerPageProps> => {
  const playerId = ctx.query.id as string;

  const [
    preloadedSummary,
    preloadedMatches,
    preloadedHeroStats,
    preloadedAchievements,
  ] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().matchApi.matchControllerPlayerMatches(playerId, 0),
    getApi().playerApi.playerControllerHeroSummary(playerId),
    getApi().playerApi.playerControllerAchievements(playerId),
  ]);

  return {
    playerId,
    preloadedSummary,
    preloadedMatches,
    preloadedHeroStats,
    preloadedAchievements,
  };
};
