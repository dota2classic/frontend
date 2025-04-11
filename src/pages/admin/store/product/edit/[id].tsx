import { getApi } from "@/api/hooks";
import { ProductDto } from "@/api/back";
import { EditProductContainer } from "@/containers";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

interface Props {
  product: ProductDto;
}
export default function EditProductPage({ product }: Props) {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.store.index.link}>Товар</PageLink>
            <span>{product.title}</span>
          </Breadcrumbs>
        </div>
      </Panel>
      <EditProductContainer product={product} />
    </>
  );
}

EditProductPage.getInitialProps = async (ctx) => {
  const productId = ctx.query.id as string;
  return {
    product:
      await getApi().adminStore.adminStoreControllerGetProduct(productId),
  };
};
