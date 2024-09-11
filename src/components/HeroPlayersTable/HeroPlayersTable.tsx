import React from "react";

import { GenericTable } from "..";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";
import { HeroPlayerDto } from "@/api/back";

interface IHeroPlayersTableProps {
  data: HeroPlayerDto[];
  loading: boolean;
}

export const HeroPlayersTable: React.FC<IHeroPlayersTableProps> = ({
  data,
  loading,
}) => {
  return (
    <GenericTable
      placeholderRows={10}
      isLoading={loading}
      keyProvider={(d) => d[0].steam_id}
      columns={[
        {
          name: "Игрок",
          type: ColumnType.Player,
        },
        {
          name: "Матчи",
          type: ColumnType.IntWithBar,
          color: colors.green,
        },
        {
          name: "Побед",
          type: ColumnType.IntWithBar,
          color: colors.green,
        },
        {
          name: "% Побед",
          type: ColumnType.PercentWithBar,
          color: colors.red,
        },
      ]}
      data={data
        .slice(0, 8)
        .map((it) => [
          { avatar: it.avatar, steam_id: it.steamId, name: it.name },
          it.games,
          it.wins,
          (it.wins / it.games) * 100,
        ])}
    />
  );
};
