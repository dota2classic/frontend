import {
  HeroPerformanceTable,
  PageLink,
  PlayerMatchTable,
  PlayerSummary,
  Section,
  TeammatesTable,
} from "@/components";
import c from "./PlayerPage.module.scss";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import {
  HeroStatsDto,
  MatchPageDto,
  PlayerSummaryDto,
  PlayerTeammatePageDto,
} from "@/api/back";
import { useQueryBackedParameter } from "@/util/hooks";
import { PlayerMatchItem } from "@/components/PlayerMatchTable/PlayerMatchTable";
import { matchToPlayerMatchItem } from "@/util/mappers";
import Head from "next/head";
import { numberOrDefault } from "@/util/urls";
import React from "react";
import { AppRouter } from "@/route";
//
// const d2: any[] = Matches.map((it) => ({
//   hero: it.radiant[0].hero,
//   kills: it.radiant[0].kills,
//   deaths: it.radiant[0].deaths,
//   assists: it.radiant[0].assists,
//   duration: it.duration,
//   timestamp: it.timestamp,
//   won: it.winner === 2,
//   level: it.radiant[0].level,
//   mode: it.mode,
//   matchId: it.id,
// }));
//
// const d3 = PlayerHeroSummary.map((it) => ({
//   hero: it.hero,
//   wins: it.wins,
//   loss: it.loss,
//   kda: it.kda,
// })).toSorted((a, b) => b.wins + b.loss - (a.wins + a.loss)).slice(0, 10);

interface PlayerPageProps {
  playerId: string;
  preloadedSummary: PlayerSummaryDto;
  preloadedMatches: MatchPageDto;
  preloadedHeroStats: HeroStatsDto[];
  preloadedTeammates: PlayerTeammatePageDto;
}

export default function PlayerPage({
  playerId,
  preloadedSummary,
  preloadedMatches,
  preloadedHeroStats,
  preloadedTeammates,
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
        <title>{`${summary.name} - статистика`}</title>
      </Head>
      <PlayerSummary
        image={summary.avatar || "/avatar.png"}
        wins={summary.wins}
        loss={summary.loss}
        rank={summary.rank}
        mmr={summary.mmr}
        name={summary.name}
        className={c.playerInfo}
        steamId={summary.steamId}
      />
      <Section className={c.matchHistory}>
        <header>
          Матчи
          <PageLink link={AppRouter.players.playerMatches(playerId).link}>
            Показать еще
          </PageLink>
        </header>
        <PlayerMatchTable loading={matchesLoading} data={formattedMatches} />
      </Section>
      <Section className={c.heroPerformance}>
        <header>
          <span>Лучшие герои</span>
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
  ] = await Promise.all<any>([
    useApi().playerApi.playerControllerPlayerSummary(playerId),
    useApi().matchApi.matchControllerPlayerMatches(playerId, page),
    useApi().playerApi.playerControllerHeroSummary(playerId),
    useApi().playerApi.playerControllerTeammates(playerId, 0, 10),
  ]);
  return {
    playerId,
    preloadedSummary,
    preloadedMatches,
    preloadedHeroStats,
    preloadedTeammates,
  };
};
