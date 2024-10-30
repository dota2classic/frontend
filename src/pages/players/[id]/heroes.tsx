import { NextPageContext } from "next";
import { GenericTable, PlayerSummary, Section } from "@/components";
import React from "react";
import { HeroStatsDto, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { AppRouter } from "@/route";
import { colors } from "@/colors";
import { winrate } from "@/util/math";

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
  const formattedHeroStats = (preloadedHeroStats || []).toSorted(
    (a, b) => b.games - a.games,
  );
  // .map((it) => ({
  //   hero: it.hero,
  //   kda: it.kda,
  //   wins: it.wins,
  //   loss: it.loss,
  // }));

  return (
    <>
      <PlayerSummary
        image={summary.user.avatar}
        name={summary.user.name}
        steamId={summary.user.steamId}
        wins={summary.wins}
        loss={summary.loss}
        rank={summary.rank}
        mmr={summary.mmr}
      />
      <Section>
        <header>Герои</header>
        <GenericTable
          columns={[
            {
              type: ColumnType.Hero,
              name: "Герой",
              noname: false,
              link: (d) => AppRouter.players.playerMatches(playerId, d[0]).link,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: "Матчи",
              color: colors.green,
              sortable: true,
              defaultSort: "desc",
            },
            {
              type: ColumnType.PercentWithBar,
              name: "% Побед",
              color: colors.green,
              sortable: true,
            },
            {
              type: ColumnType.FloatWithBar,
              name: "KDA",
              color: colors.red,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: "ЗВМ",
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: "ОВМ",
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: "Добито",
              color: colors.grey,
              sortable: true,
            },
            {
              type: ColumnType.IntWithBar,
              name: "Не отдано",
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
