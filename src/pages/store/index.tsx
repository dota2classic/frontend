import { StoreLanding } from "@/containers/StoreLanding";
import { getApi } from "@/api/hooks";
import { SubscriptionProductDto } from "@/api/back";
import { LayoutConfig } from "@/components/Layout";

interface Props {
  products: SubscriptionProductDto[];
}
export default function StorePage({ products }: Props) {
  return <StoreLanding products={products} />;
}

StorePage.layoutConfig = {
  fullBleed: true,
} satisfies LayoutConfig;

StorePage.getInitialProps = async () => {
  const products = await getApi().payment.userPaymentsControllerGetProducts();

  return {
    products,
  };
};
