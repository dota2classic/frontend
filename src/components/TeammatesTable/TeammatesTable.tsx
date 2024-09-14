import React from "react";

import { GenericTable } from "..";
import { PlayerTeammateDto } from "@/api/back";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";

interface ITeammatesTableProps {
  data: PlayerTeammateDto[];
}

export const TeammatesTable: React.FC<ITeammatesTableProps> = ({ data }) => {
  return (
    <GenericTable
      placeholderRows={20}
      columns={[
        {
          type: ColumnType.Player,
          name: "Игрок",
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: "% Побед",
        },
      ]}
      data={data.map((it) => [
        { steam_id: it.steamId, name: it.name, avatar: it.avatar },
        it.games,
        it.winrate * 100,
      ])}
      isLoading={false}
      keyProvider={(it) => it[0].steam_id}
    />
  );
};
