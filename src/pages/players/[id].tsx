import {
  HeroPerformanceTable,
  PlayerMatchTable,
  PlayerSummary,
} from "@/components";
import c from "./PlayerPage.module.scss";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import {
  HeroStatsDto,
  MatchPageDto,
  PlayerGeneralStatsDto,
  PlayerSummaryDto,
} from "@/api/back";
import { useQueryBackedParameter } from "@/util/hooks";
import { PlayerMatchItem } from "@/components/PlayerMatchTable/PlayerMatchTable";
import { matchToPlayerMatchItem } from "@/util/mappers";
import Head from "next/head";
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
  preloadedStats: PlayerGeneralStatsDto;
  preloadedMatches: MatchPageDto;
  preloadedHeroStats: HeroStatsDto[];
}

export default function PlayerPage({
  playerId,
  preloadedSummary,
  preloadedStats,
  preloadedMatches,
  preloadedHeroStats,
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

  const { data: generalStats } =
    useApi().playerApi.usePlayerControllerGeneralSummary(playerId, {
      fallbackData: preloadedStats,
      isPaused() {
        return !!preloadedStats;
      },
    });

  const { data: matches } = useApi().matchApi.useMatchControllerPlayerMatches(
    playerId,
    page || 0,
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

  const { data: heroStats } = useApi().playerApi.usePlayerControllerHeroSummary(
    playerId,
    {
      fallbackData: preloadedHeroStats,
      isPaused() {
        return !!preloadedHeroStats;
      },
    },
  );

  if (!summary || !generalStats) return null;

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
        <title>{summary.name} - статистика</title>
      </Head>
      <PlayerSummary
        image={summary.avatar || "/avatar.png"}
        wins={generalStats.wins}
        loss={generalStats.loss}
        rating={summary.mmr}
        name={summary.name}
        className={c.playerInfo}
        steamId={summary.steamId}
      />
      <PlayerMatchTable className={c.matchHistory} data={formattedMatches} />
      <HeroPerformanceTable
        className={c.heroPerformance}
        data={formattedHeroStats}
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
    preloadedStats,
    preloadedMatches,
    preloadedHeroStats,
  ] = await Promise.all<any>([
    useApi().playerApi.playerControllerPlayerSummary(playerId),
    useApi().playerApi.playerControllerGeneralSummary(playerId),
    useApi().matchApi.matchControllerPlayerMatches(playerId, page),
    useApi().playerApi.playerControllerHeroSummary(playerId),
  ]);
  return {
    playerId,
    preloadedSummary,
    preloadedStats,
    preloadedMatches,
    preloadedHeroStats,
  };
};
