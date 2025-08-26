import React from "react";

import { GenericTable, Tooltipable } from "..";
import { ColumnType } from "@/const/tables";
import { colors } from "@/colors";
import { itemName } from "@/util/heroName";
import { ItemDto } from "@/api/back";
import { FaCrown } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface IItemsTableProps {
  items: ItemDto[];
}

export const ItemsTable: React.FC<IItemsTableProps> = ({ items }) => {
  const { t } = useTranslation();

  return (
    <GenericTable
      columns={[
        {
          type: ColumnType.Raw,
          name: (
            <Tooltipable tooltip={t("items_table.popularityTooltip")}>
              <FaCrown />
            </Tooltipable>
          ),
          sortable: true,
        },
        {
          type: ColumnType.Item,
          name: t("items_table.item"),
        },
        {
          type: ColumnType.IntWithBar,
          name: t("items_table.games"),
          sortable: true,
          defaultSort: "desc",
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("items_table.winRate"),
          sortable: true,
        },
      ]}
      keyProvider={(it) => it[1]}
      data={items
        .filter((t) => !itemName(t.item).includes("Рецепт"))
        .map((it) => [
          it.popularity,
          it.item,
          it.games,
          (it.wins / Math.max(1, it.games)) * 100,
        ])}
      isLoading={false}
      placeholderRows={100}
    />
  );
};
