import { getApi } from "@/api/hooks";
import { ItemDto } from "@/api/back";
import { GenericTable } from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";
import { itemName } from "@/util/heroName";

interface Props {
  items: ItemDto[];
}

export default function ItemsPage({ items }: Props) {
  return (
    <>
      <GenericTable
        columns={[
          {
            type: ColumnType.Raw,
            name: "Популярность",
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
    </>
  );
}

ItemsPage.getInitialProps = async (): Promise<Props> => {
  return {
    items: await getApi().metaApi.metaControllerItems(),
  };
};
