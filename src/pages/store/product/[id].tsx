import { ProductDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { Button, ProductCard } from "@/components";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useCallback } from "react";
import { AppRouter } from "@/route";

interface Props {
  product: ProductDto;
}

export default function ProductPage({ product }: Props) {
  const purchase = useCallback(async () => {
    await getApi().store.storeControllerPurchaseProduct(product.id);
    await AppRouter.store.index.open();
  }, [product.id]);
  return (
    <>
      <ProductCard product={product} />

      <Button mega onClick={purchase}>
        Купить
      </Button>
    </>
  );
}

ProductPage.getInitialProps = async (ctx) => {
  const productId = ctx.query.id as string;
  return {
    product: await withTemporaryToken(ctx, () =>
      getApi().store.storeControllerGetProduct(productId),
    ),
  };
};
