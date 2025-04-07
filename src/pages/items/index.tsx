import { getApi } from "@/api/hooks";
import { ItemDto } from "@/api/back";
import { ItemBreadcrumbs } from "@/containers";
import { ItemsTable } from "@/components";

interface Props {
  items: ItemDto[];
}

export default function ItemsPage({ items }: Props) {
  // use
  return (
    <>
      <ItemBreadcrumbs itemId={undefined} />
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
