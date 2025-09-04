import { StoreLanding } from "@/containers/StoreLanding";
import { getApi } from "@/api/hooks";
import { SubscriptionProductDto } from "@/api/back";

interface Props {
  products: SubscriptionProductDto[];
}
export default function StorePage({ products }: Props) {
  return <StoreLanding products={products} />;
}

StorePage.getInitialProps = async () => {
  const products = await getApi().payment.userPaymentsControllerGetProducts();

  return {
    products,
  };
};
