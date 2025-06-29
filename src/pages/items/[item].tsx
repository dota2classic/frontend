import { NextPageContext } from "next";
import { getApi } from "@/api/hooks";
import { ItemHeroDto } from "@/api/back";
import { GenericTable, Section } from "@/components";
import { colors } from "@/colors";
import c from "./Items.module.scss";
import { ColumnType } from "@/const/tables";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppRouter } from "@/route";
import { useRouterChanging } from "@/util";
import { ItemBreadcrumbs } from "@/containers";
import { useRouter } from "next/router";

interface Props {
  data: ItemHeroDto[];
  item: number;
}

//ни в коем случае не ставить в конце слэш
const BASE_URL = "https://wiki.dotaclassic.ru";

export default function ItemPage({ data, item }: Props) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [iframeSrc] = useState(() => `${BASE_URL}/slim/items/${item}`);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    sendRouteToIframe(iframeRef, router.asPath);
  }, [router.asPath]);

  function sendRouteToIframe(ref: React.RefObject<HTMLIFrameElement | null>, route: string) {
    const target = ref.current?.contentWindow;
    if (!target) return;

    const msg = { type: "sync-route", route: `/slim${route}` };
    target.postMessage(msg, BASE_URL);
  }

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
          <iframe
            ref={iframeRef}
            src={iframeSrc}
          />
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
