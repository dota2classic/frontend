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
import type { PlayerMatchItem } from "@/components/HeroWithItemsHistoryTable";
import { matchToPlayerMatchItem } from "@/util/mappers";
import React from "react";
import { AppRouter } from "@/route";
import { MatchComparator } from "@/util/sorts";
import { LazyPaginatedThread } from "@/containers/Thread/LazyPaginatedThread";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerSummary } from "@/components/PlayerSummary";
import { Section } from "@/components/Section";
import { Panel } from "@/components/Panel";
import { AchievementStatus } from "@/components/AchievementStatus";
import { HeroPerformanceTable } from "@/components/HeroPerformanceTable";
import { PageLink } from "@/components/PageLink";
import { PlayerPentagonStats } from "@/components/PlayerPentagonStats";

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
  const { t } = useTranslation();

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
      <EmbedProps
        title={t("player_page.seo.title", { username: summary.user.name })}
        description={t("player_page.seo.description", {
          username: summary.user.name,
        })}
        image={summary.user.avatar}
      />
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        lastGameTimestamp={formattedMatches[0]?.timestamp}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <Section style={{ gridColumn: "span 12" }}>
        <header>{t("player_page.achievements")}</header>
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
          <span>{t("player_page.summary")}</span>
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
          <span>{t("player_page.topHeroes")}</span>
          <PageLink link={AppRouter.players.player.heroes(playerId).link}>
            {t("tables.showAll")}
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
