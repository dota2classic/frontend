import { NextPageContext } from "next";
import { getApi } from "@/api/hooks";
import { StoreCategoryDto, StorePageDto } from "@/api/back";
import {
  BigTabs,
  Carousel,
  PageLink,
  ProductCard,
  Section,
} from "@/components";
import React from "react";
import { useQueryBackedParameter } from "@/util";
import { AppRouter } from "@/route";

interface Props {
  store: StorePageDto;
  categories: StoreCategoryDto[];
}

export default function AdminStorePage({ store, categories }: Props) {
  const [category, setCategory] = useQueryBackedParameter("category");

  const currentCategory =
    store.categories.find((t) => t.category === category) ||
    store.categories[0];

  return (
    <>
      <PageLink link={AppRouter.admin.store.createProduct().link}>
        Создать продукт
      </PageLink>
      <BigTabs<string>
        selected={category || "hats"}
        items={categories.map((t) => ({
          key: t.category,
          label: t.category,
          onSelect: setCategory,
        }))}
        flavor={"small"}
      />
      <Section>
        <header>{currentCategory.category}</header>
        <Carousel gridCnt={4}>
          {currentCategory.products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              link={AppRouter.admin.store.editProduct(product.id).link}
            />
          ))}
        </Carousel>
      </Section>
    </>
  );
}

AdminStorePage.getInitialProps = async (ctx: NextPageContext) => {
  const store = await getApi().store.storeControllerGetStorePage();
  const categories = await getApi().store.storeControllerCategories();

  return {
    store,
    categories,
  };
};
