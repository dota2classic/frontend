import { StoreLanding } from "@/containers/StoreLanding";
import { SubscriptionProductDto } from "@/api/back";
import { LayoutConfig } from "@/components/Layout";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface Props {
  products: SubscriptionProductDto[];
}
export default function StorePage({ products }: Props) {
  return <StoreLanding products={products} />;
}

StorePage.layoutConfig = {
  fullBleed: true,
} satisfies LayoutConfig;

StorePage.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const products = await api.payment.userPaymentsControllerGetProducts();

  return {
    products,
  };
};
