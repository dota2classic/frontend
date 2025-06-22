import React from "react";

import { GenericTable } from "..";
import { HeroItemDto } from "@/api/back";
import { colors } from "@/colors";
import { ColumnType } from "@/const/tables";

interface IHeroItemsTableProps {
  data: HeroItemDto[];
  loading: boolean;
  className?: string;
}

export const HeroItemsTable: React.FC<IHeroItemsTableProps> = ({
  data,
  className,
  loading,
}) => {
  return (
    <GenericTable
      className={className}
      isLoading={loading}
      placeholderRows={20}
      keyProvider={(it) => it[0]}
      columns={[
        {
          type: ColumnType.Item,
          name: "Предмет",
          maxWidth: 120
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
          color: colors.green,
          sortable: true,
          defaultSort: "desc",
        },
        {
          type: ColumnType.IntWithBar,
          name: "Победы",
          color: colors.green,
          sortable: true,
        },
        {
          type: ColumnType.PercentWithBar,
          name: "Доля побед",
          sortable: true,
        },
      ]}
      data={data.map((it) => [
        it.item,
        it.gameCount,
        it.wins,
        (it.wins / it.gameCount) * 100,
      ])}
    />
  );
};
