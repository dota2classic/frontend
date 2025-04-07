import React from "react";

import { GenericTable, Tooltipable } from "..";
import { ColumnType } from "@/const/tables";
import { colors } from "@/colors";
import { itemName } from "@/util/heroName";
import { ItemDto } from "@/api/back";
import { FaCrown } from "react-icons/fa";

interface IItemsTableProps {
  items: ItemDto[];
}

export const ItemsTable: React.FC<IItemsTableProps> = ({ items }) => {
  return (
    <GenericTable
      columns={[
        {
          type: ColumnType.Raw,
          name: (
            <Tooltipable tooltip={"Популярность"}>
              <FaCrown />
            </Tooltipable>
          ),
          sortable: true,
        },
        {
          type: ColumnType.Item,
          name: "Предмет",
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
          sortable: true,
          defaultSort: "desc",
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: "Доля побед",
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
