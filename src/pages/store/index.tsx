import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { StorePageDto } from "@/api/back";
import { Carousel, ProductCard, Section } from "@/components";
import React from "react";
import { AppRouter } from "@/route";

interface Props {
  store: StorePageDto;
}

export default function StorePage({ store }: Props) {
  return (
    <>
      {store.categories.map((category) => (
        <Section>
          <header>{category.category}</header>
          <Carousel gridCnt={4}>
            {category.products.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                link={AppRouter.store.product(product.id).link}
              />
            ))}
          </Carousel>
        </Section>
      ))}
    </>
  );
}

StorePage.getInitialProps = async (ctx: NextPageContext) => {
  const store = await withTemporaryToken(ctx, () =>
    getApi().store.storeControllerGetStorePage(),
  );

  return {
    store,
  };
};
