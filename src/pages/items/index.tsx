import { getApi } from "@/api/hooks";
import { ItemDto } from "@/api/back";
import { ItemBreadcrumbs } from "@/containers/ItemBreadcrumbs";
import { EmbedProps } from "@/components/EmbedProps";
import { ItemsTable } from "@/components/ItemsTable";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  items: ItemDto[];
}

export default function ItemsPage({ items }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <ItemBreadcrumbs itemId={undefined} />
      <EmbedProps
        title={t("items_page.seo.title")}
        description={t("items_page.seo.description")}
      />
      <br />
      <ItemsTable items={items} />
    </>
  );
}

ItemsPage.getInitialProps = async (): Promise<Props> => {
  return {
    items: await getApi().metaApi.metaControllerItems(),
  };
};
