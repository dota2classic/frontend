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
  summary: PlayerSummaryDto;
  matches: MatchPageDto;
  heroStats: HeroStatsDto[];
  achievements: AchievementDto[];
}

export default function PlayerPage({
  playerId,
  summary,
  matches,
  heroStats,
  achievements,
}: PlayerPageProps) {
  const formattedMatches: PlayerMatchItem[] = (matches?.data || [])
    .sort(MatchComparator)
    .map((it) =>
      matchToPlayerMatchItem(it, (it) => it.user.steamId === playerId),
    );

  const formattedHeroStats = (heroStats || [])
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
        <title>{`${summary.user.name} - статистика`}</title>
      </Head>
      <EmbedProps
        title={`${summary.user.name} - статистика`}
        description={`Профиль и статистика игрока ${summary.user.name}`}
        image={summary.user.avatar}
      />
      <PlayerSummary
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        lastGameTimestamp={formattedMatches[0]?.timestamp}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <Section style={{ gridColumn: "span 12" }}>
        <header>Достижения</header>
        <Panel className={c.achievements}>
          {achievements
            .sort((a, b) => b.key - a.key)
            .map((t) => (
              <AchievementStatus key={t.key} achievement={t} />
            ))}
        </Panel>
      </Section>
      <Section className={c.matchHistory}>
        <header data-testid="player-hero-performance-header">
          <span>Сводка</span>
        </header>
        <PlayerPentagonStats
          games={summary.seasonStats.gamesPlayed}
          aspects={summary.aspects}
          abandons={summary.seasonStats.abandons}
          kills={summary.seasonStats.kills}
          deaths={summary.seasonStats.deaths}
          assists={summary.seasonStats.assists}
          playtime={summary.seasonStats.playtime}
          wins={summary.seasonStats.wins}
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
        startLatest
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

  const [summary, matches, heroStats, achievements] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().matchApi.matchControllerPlayerMatches(playerId, 0, 1),
    getApi().playerApi.playerControllerHeroSummary(playerId),
    getApi().playerApi.playerControllerAchievements(playerId),
  ]);

  return {
    playerId,
    summary,
    matches,
    heroStats,
    achievements,
  };
};
