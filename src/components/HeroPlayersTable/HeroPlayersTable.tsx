import React from "react";

import { GenericTable } from "..";
import { colors } from "@/colors";
import { HeroPlayerDto } from "@/api/back";
import { ColumnType } from "@/const/tables";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";

interface IHeroPlayersTableProps {
  hero: string;
  data: HeroPlayerDto[];
  loading: boolean;
}

export const HeroPlayersTable: React.FC<IHeroPlayersTableProps> = ({
  hero,
  data,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <GenericTable
      placeholderRows={10}
      isLoading={loading}
      keyProvider={(d) => d[0].steam_id}
      columns={[
        {
          name: t("hero_players_table.player"),
          type: ColumnType.Player,
          maxWidth: 160,
          link: (d) => AppRouter.players.playerMatches(d[0].steamId, hero).link,
        },
        {
          name: t("hero_players_table.matches"),
          type: ColumnType.IntWithBar,
          color: colors.green,
        },
        {
          name: t("hero_players_table.winRate"),
          type: ColumnType.PercentWithBar,
          color: colors.red,
        },
        {
          name: t("hero_players_table.kda"),
          type: ColumnType.KDA,
        },
      ]}
      data={data
        .slice(0, 8)
        .map((it) => [
          it.user,
          it.games,
          (it.wins / it.games) * 100,
          { kills: it.kills, deaths: it.deaths, assists: it.assists },
        ])}
    />
  );
};
