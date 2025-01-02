import { NextPageContext } from "next";
import { getApi } from "@/api/hooks";
import { ItemHeroDto } from "@/api/back";
import { GenericTable, Section } from "@/components";
import { colors } from "@/colors";
import c from "./Items.module.scss";
import { ItemTooltipRaw } from "@/components/ItemTooltip/ItemTooltip";
import { ColumnType } from "@/const/tables";

interface Props {
  data: ItemHeroDto[];
  item: number;
}

export default function ItemPage({ data, item }: Props) {
  return (
    <div className={c.itemPage}>
      <Section className={c.heroes}>
        <GenericTable
          isLoading={false}
          placeholderRows={100}
          keyProvider={(it) => it[0]}
          columns={[
            {
              type: ColumnType.Hero,
              name: "Герой",
            },
            {
              type: ColumnType.IntWithBar,
              name: "Матчи",
            },
            {
              type: ColumnType.IntWithBar,
              name: "Побед",
              color: colors.green,
            },
            {
              type: ColumnType.PercentWithBar,
              name: "Доля побед",
              color: colors.green,
            },
          ]}
          data={data
            .sort((a, b) => b.played - a.played)
            .map((it) => [
              it.hero,
              it.played,
              it.wins,
              (it.wins / Math.max(1, it.played)) * 100,
            ])}
        />
      </Section>
      <Section className={c.itemData}>
        <ItemTooltipRaw item={item} />
      </Section>
    </div>
  );
}

ItemPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const itemId = parseInt(ctx.query.item as string);

  return {
    data: await getApi().metaApi.metaControllerItem(itemId),
    item: itemId,
  };
};
