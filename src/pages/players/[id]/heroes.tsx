import { NextPageContext } from "next";
import { EmbedProps } from "@/components/EmbedProps";
import { GenericTable } from "@/components/GenericTable";
import { PlayerSummary } from "@/components/PlayerSummary";
import { Section } from "@/components/Section";
import React from "react";
import { HeroStatsDto, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import { colors } from "@/colors";
import { winrate } from "@/util/math";
import { ColumnType } from "@/const/tables";
import { useTranslation } from "react-i18next";

interface Props {
  summary: PlayerSummaryDto;
  preloadedHeroStats: HeroStatsDto[];
  playerId: string;
}

export default function PlayerHeroes({
  preloadedHeroStats,
  playerId,
  summary,
}: Props) {
  const { t } = useTranslation();
  const formattedHeroStats = (preloadedHeroStats || []).toSorted(
    (a, b) => b.games - a.games,
  );

  return (
    <>
      <EmbedProps
        title={t("player_heroes.playerHeroesTitle", {
          playerName: summary.user.name,
        })}
        description={t("player_heroes.heroStatsDescription", {
          playerName: summary.user.name,
        })}
      />
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        user={summary.user}
        stats={summary.overallStats}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <Section>
        <header>{t("player_heroes.heroesHeader")}</header>
        <GenericTable
          columns={[
            {
              type: ColumnType.Hero,
              name: t("player_heroes.heroColumn"),
              noname: false,
              link: (d) => AppRouter.players.playerMatches(playerId, d[0]).link,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: t("player_heroes.matchesColumn"),
              color: colors.green,
              sortable: true,
              defaultSort: "desc",
            },
            {
              type: ColumnType.PercentWithBar,
              name: t("player_heroes.winrateColumn"),
              color: colors.green,
              sortable: true,
            },
            {
              type: ColumnType.FloatWithBar,
              name: t("player_heroes.kdaColumn"),
              color: colors.red,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: t("player_heroes.gpmColumn"),
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: t("player_heroes.xpmColumn"),
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: t("player_heroes.lastHitsColumn"),
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: t("player_heroes.deniesColumn"),
              color: colors.grey,
              sortable: true,
            },
          ]}
          placeholderRows={50}
          isLoading={false}
          keyProvider={(it) => it[0]}
          data={formattedHeroStats.map((it) => [
            it.hero,
            it.games,
            winrate(it.wins, it.loss) * 100,
            it.kda,
            it.gpm,
            it.xpm,
            it.lastHits,
            it.denies,
          ])}
        />
      </Section>
    </>
  );
}

PlayerHeroes.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const playerId = ctx.query.id as string;

  return {
    summary: await getApi().playerApi.playerControllerPlayerSummary(playerId),
    preloadedHeroStats:
      await getApi().playerApi.playerControllerHeroSummary(playerId),
    playerId,
  };
};
