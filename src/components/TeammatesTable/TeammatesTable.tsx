import React from "react";

import { GenericTable } from "..";
import { PlayerTeammateDto } from "@/api/back";
import { colors } from "@/colors";
import { ColumnType } from "@/const/tables";
import { useTranslation } from "react-i18next";

interface ITeammatesTableProps {
  data: PlayerTeammateDto[];
}

export const TeammatesTable: React.FC<ITeammatesTableProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <GenericTable
      placeholderRows={20}
      columns={[
        {
          type: ColumnType.Player,
          name: t("teammates_table.player"),
        },
        {
          type: ColumnType.IntWithBar,
          name: t("teammates_table.matches"),
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("teammates_table.winrate"),
        },
      ]}
      data={data.map((it) => [it.user, it.games, it.winrate * 100])}
      isLoading={false}
      keyProvider={(it) => it[0].steamId}
    />
  );
};
