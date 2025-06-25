import React from "react";
import { getApi } from "@/api/hooks";
import { Button, Input, Panel, SelectOptions } from "@/components";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { SubscriptionProductDto } from "@/api/back";
import { useAsyncButton } from "@/util/use-async-button";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { handleException } from "@/util/handleException";

interface IGiveProductContainerProps {
  steamId: string;
}

export const GiveProductContainer: React.FC<IGiveProductContainerProps> =
  observer(({ steamId }) => {
    const state = useLocalObservable<{
      product?: SubscriptionProductDto;
      transactionId: string;
    }>(() => ({
      transactionId: "",
    }));
    const { data } = getApi().payment.useUserPaymentsControllerGetProducts();

    const [isGiving, giveProduct] = useAsyncButton(async () => {
      if (!state.product) return;
      try {
        await getApi().payment.userPaymentsControllerSimulatePayment({
          steamId,
          productId: state.product.id,
          paymentId: state.transactionId,
        });

        makeSimpleToast("Подписка успешно выдана!", "Сюда лут", 5000);
      } catch (e) {
        await handleException("Ошибка при выдаче подписки!", e);
      }
    }, [steamId, state]);

    if (!data) return "Загрузка...";
    return (
      <Panel>
        <SelectOptions
          defaultText={"Наказание"}
          onSelect={(p: { value: number; label: string } | undefined) => {
            runInAction(() => {
              state.product = data!.find((t) => t.id === p?.value);
            });
          }}
          selected={state.product?.id}
          options={data.map((product) => ({
            label: (
              <>
                {product.months} месяцев, $
                {product.months * product.pricePerMonth}
              </>
            ),
            value: product.id,
          }))}
        />
        <Input
          value={state.transactionId}
          onChange={(e) =>
            runInAction(() => {
              state.transactionId = e.target.value;
            })
          }
        />

        <Button
          small
          disabled={isGiving || !state.product || !state.transactionId}
          onClick={giveProduct}
        >
          Выдать подписку
        </Button>
      </Panel>
    );
  });
