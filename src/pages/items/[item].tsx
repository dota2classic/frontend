import { NextPageContext } from "next";
import { getApi } from "@/api/hooks";
import { ItemHeroDto } from "@/api/back";
import { GenericTable, Section } from "@/components";
import { colors } from "@/colors";
import c from "./Items.module.scss";
import { ColumnType } from "@/const/tables";
import React, { useEffect, useMemo } from "react";
import { AppRouter } from "@/route";
import { useRouterChanging } from "@/util";
import { ItemBreadcrumbs } from "@/containers";

interface Props {
  data: ItemHeroDto[];
  item: number;
}

export default function ItemPage({ data, item }: Props) {
  useEffect(() => {
    const iframeListener = (e: MessageEvent) => {
      if (e.data?.type === "route-change") {
        const newItemId = Number(e.data.itemId);
        if (item !== newItemId) {
          AppRouter.items.item(newItemId).open(false);
        }
      }
    };
    window.addEventListener("message", iframeListener);
    return () => window.removeEventListener("message", iframeListener);
  }, [item]);

  const originalUrl = useMemo(() => {
    return `https://wiki.dotaclassic.ru/slim/items/${item}`;
  }, []);

  const [isLoading] = useRouterChanging();

  if (Number.isNaN(item)) return null;
  return (
    <>
      <ItemBreadcrumbs itemId={item} />
      <div className={c.itemPage}>
        <Section className={c.heroes}>
          <GenericTable
            isLoading={isLoading}
            placeholderRows={100}
            keyProvider={(it) => it[0]}
            columns={[
              {
                type: ColumnType.Hero,
                name: "Герой",
                sortable: true,
              },
              {
                type: ColumnType.IntWithBar,
                name: "Матчи",
                sortable: true,
                defaultSort: "desc",
              },
              {
                type: ColumnType.IntWithBar,
                name: "Побед",
                color: colors.green,
                sortable: true,
              },
              {
                type: ColumnType.PercentWithBar,
                name: "Доля побед",
                color: colors.green,
                sortable: true,
              },
            ]}
            data={data.map((it) => [
              it.hero,
              it.played,
              it.wins,
              (it.wins / Math.max(1, it.played)) * 100,
            ])}
          />
        </Section>
        <Section className={c.itemData}>
          <iframe src={originalUrl}></iframe>
        </Section>
      </div>
    </>
  );
}

ItemPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const itemId = parseInt(ctx.query.item as string);

  return {
    data: await getApi().metaApi.metaControllerItem(itemId),
    item: itemId,
  };
};
