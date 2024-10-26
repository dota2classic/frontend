import {
  AchievementStatus,
  EmbedProps,
  HeroPerformanceTable,
  HeroWithItemsHistoryTable,
  PageLink,
  Panel,
  PlayerSummary,
  Section,
  TeammatesTable,
  Thread,
} from "@/components";
import c from "./PlayerPage.module.scss";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import {
  AchievementDto,
  HeroStatsDto,
  MatchPageDto,
  PlayerSummaryDto,
  PlayerTeammatePageDto,
  ThreadType,
} from "@/api/back";
import { useQueryBackedParameter } from "@/util/hooks";
import { PlayerMatchItem } from "@/components/HeroWithItemsHistoryTable/HeroWithItemsHistoryTable";
import { matchToPlayerMatchItem } from "@/util/mappers";
import Head from "next/head";
import { numberOrDefault } from "@/util/urls";
import React from "react";
import { AppRouter } from "@/route";

//
interface PlayerPageProps {
  playerId: string;
  preloadedSummary: PlayerSummaryDto;
  preloadedMatches: MatchPageDto;
  preloadedHeroStats: HeroStatsDto[];
  preloadedTeammates: PlayerTeammatePageDto;
  preloadedAchievements: AchievementDto[];
}

export default function PlayerPage({
  playerId,
  preloadedSummary,
  preloadedMatches,
  preloadedHeroStats,
  preloadedTeammates,
  preloadedAchievements,
}: PlayerPageProps) {
  const [page, setPage] = useQueryBackedParameter("page");

  const { data: summary } = useApi().playerApi.usePlayerControllerPlayerSummary(
    playerId,
    {
      fallbackData: preloadedSummary,
      isPaused() {
        return !!preloadedSummary;
      },
    },
  );

  const { data: matches, isLoading: matchesLoading } =
    useApi().matchApi.useMatchControllerPlayerMatches(
      playerId,
      numberOrDefault(page, 0),
      undefined,
      undefined,
      undefined,
      {
        fallbackData: preloadedMatches,
        isPaused() {
          return !!preloadedMatches;
        },
      },
    );

  const { data: heroStats, isLoading: heroStatsLoading } =
    useApi().playerApi.usePlayerControllerHeroSummary(playerId, {
      fallbackData: preloadedHeroStats,
      isPaused() {
        return !!preloadedHeroStats;
      },
    });

  if (!summary) return null;

  const formattedMatches: PlayerMatchItem[] = (matches?.data || []).map((it) =>
    matchToPlayerMatchItem(it, (it) => it.steamId === playerId),
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
        <title>{`${summary.user.name} - статистика`}</title>
      </Head>
      <EmbedProps
        title={`${summary.user.name} - статистика`}
        description={`Dota2Classic - профиль и статистика игрока ${summary.user.name}`}
        image={summary.user.avatar}
      />
      <PlayerSummary
        wins={summary.wins}
        loss={summary.loss}
        rank={summary.rank}
        mmr={summary.mmr}
        image={summary.user.avatar || "/avatar.png"}
        name={summary.user.name}
        steamId={summary.user.steamId}
      />
      <Panel style={{ display: "flex", gap: "10px", marginTop: 20 }}>
        {preloadedAchievements.map((t) => (
          <AchievementStatus achievement={t} />
        ))}
      </Panel>
      <Section className={c.matchHistory}>
        <header>
          Матчи
          <PageLink link={AppRouter.players.playerMatches(playerId).link}>
            Показать еще
          </PageLink>
        </header>
        <HeroWithItemsHistoryTable
          loading={matchesLoading}
          data={formattedMatches}
        />
      </Section>
      <Section className={c.heroPerformance}>
        <header>
          <span>Лучшие герои</span>
          <PageLink link={AppRouter.players.player.heroes(playerId).link}>
            Показать всех
          </PageLink>
        </header>
        <HeroPerformanceTable
          steamId={playerId}
          loading={heroStatsLoading}
          data={formattedHeroStats}
        />
        <header>
          Лучшие тиммейты{" "}
          <PageLink link={AppRouter.players.player.teammates(playerId).link}>
            Показать всех
          </PageLink>
        </header>
        <TeammatesTable data={preloadedTeammates!.data} />
      </Section>
      <Thread
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
  const page = Number(ctx.query.page as string) || 0;

  const [
    preloadedSummary,
    preloadedMatches,
    preloadedHeroStats,
    preloadedTeammates,
    preloadedAchievements,
  ] = await Promise.all<any>([
    useApi().playerApi.playerControllerPlayerSummary(playerId),
    useApi().matchApi.matchControllerPlayerMatches(playerId, page),
    useApi().playerApi.playerControllerHeroSummary(playerId),
    useApi().playerApi.playerControllerTeammates(playerId, 0, 10),
    useApi().playerApi.playerControllerAchievements(playerId),
  ]);

  return {
    playerId,
    preloadedSummary,
    preloadedMatches,
    preloadedHeroStats,
    preloadedTeammates,
    preloadedAchievements,
  };
};
