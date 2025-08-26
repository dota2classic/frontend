import React from "react";

import { GenericTable } from "..";
import { HeroItemDto } from "@/api/back";
import { colors } from "@/colors";
import { ColumnType } from "@/const/tables";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <GenericTable
      className={className}
      isLoading={loading}
      placeholderRows={20}
      keyProvider={(it) => it[0]}
      columns={[
        {
          type: ColumnType.Item,
          name: t("hero_items_table.item"),
          maxWidth: 120,
        },
        {
          type: ColumnType.IntWithBar,
          name: t("hero_items_table.matches"),
          color: colors.green,
          sortable: true,
          defaultSort: "desc",
        },
        {
          type: ColumnType.IntWithBar,
          name: t("hero_items_table.wins"),
          color: colors.green,
          sortable: true,
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("hero_items_table.winPercentage"),
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
