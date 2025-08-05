import { getApi } from "@/api/hooks";
import { ItemDto } from "@/api/back";
import { ItemBreadcrumbs } from "@/containers";
import { EmbedProps, ItemsTable } from "@/components";
import React from "react";

interface Props {
  items: ItemDto[];
}

export default function ItemsPage({ items }: Props) {
  // use
  return (
    <>
      <ItemBreadcrumbs itemId={undefined} />
      <EmbedProps
        title={"Предметы"}
        description={`Интерактивная энциклопедия предметов Dota 2 6.84c, цена, сборки и магазины в старой доте.`}
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
