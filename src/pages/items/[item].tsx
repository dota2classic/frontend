import { NextPageContext } from "next";
import { getApi } from "@/api/hooks";
import { ItemHeroDto } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { GenericTable } from "@/components/GenericTable";
import { Section } from "@/components/Section";
import { colors } from "@/colors";
import c from "./Items.module.scss";
import { ColumnType } from "@/const/tables";
import React, { useEffect, useRef, useState } from "react";
import { AppRouter } from "@/route";
import { useRouterChanging } from "@/util/useRouterChanging";
import { ItemBreadcrumbs } from "@/containers/ItemBreadcrumbs";
import { useRouter } from "next/router";
import { ItemData } from "@/const/itemdata";
import { useTranslation } from "react-i18next";

interface Props {
  data: ItemHeroDto[];
  item: number;
}

export default function ItemPage({ data, item }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const BASE_URL = process.env.WIKI_URL;
  const [iframeSrc] = useState(() => `${BASE_URL}/slim/items/${item}`);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    sendRouteToIframe(iframeRef, router.asPath);
  }, [router.asPath]);

  function sendRouteToIframe(
    ref: React.RefObject<HTMLIFrameElement | null>,
    route: string,
  ) {
    const target = ref.current?.contentWindow;
    if (!target) return;

    const msg = { type: "sync-route", route: `/slim${route}` };
    target.postMessage(msg, BASE_URL as string);
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

  const itemData = ItemData.find((t) => t.id === item);
  return (
    <>
      <ItemBreadcrumbs itemId={item} />
      <EmbedProps
        title={itemData?.name || t("item_page.seo.title")}
        description={`${t("item_page.seo.description", { item: itemData?.name, patch: "6.84c", game: "Dota 2" })}`}
      />
      <div className={c.itemPage}>
        <Section className={c.heroes}>
          <GenericTable
            isLoading={isLoading}
            placeholderRows={100}
            keyProvider={(it) => it[0]}
            columns={[
              {
                type: ColumnType.Hero,
                name: t("item_page.hero"),
                sortable: true,
              },
              {
                type: ColumnType.IntWithBar,
                name: t("item_page.matches"),
                sortable: true,
                defaultSort: "desc",
              },
              {
                type: ColumnType.IntWithBar,
                name: t("item_page.wins"),
                color: colors.green,
                sortable: true,
              },
              {
                type: ColumnType.PercentWithBar,
                name: t("item_page.winRate"),
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
          <iframe ref={iframeRef} src={iframeSrc} />
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
