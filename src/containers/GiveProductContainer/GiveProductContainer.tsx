import React from "react";
import { getApi } from "@/api/hooks";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { SubscriptionProductDto } from "@/api/back";
import { useAsyncButton } from "@/util/use-async-button";
import { makeSimpleToast } from "@/components/Toast";
import { handleException } from "@/util/handleException";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/Panel";
import { SelectOptions } from "@/components/SelectOptions";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface IGiveProductContainerProps {
  steamId: string;
}

export const GiveProductContainer: React.FC<IGiveProductContainerProps> =
  observer(({ steamId }) => {
    const { t } = useTranslation();
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

        makeSimpleToast(
          t("giveProduct.successMessage"),
          t("giveProduct.toastTitle"),
          5000,
        );
      } catch (e) {
        await handleException(t("giveProduct.errorMessage"), e);
      }
    }, [steamId, state]);

    if (!data) return t("giveProduct.loading");
    return (
      <Panel>
        <SelectOptions
          defaultText={t("giveProduct.defaultText")}
          onSelect={(p: { value: number; label: string } | undefined) => {
            runInAction(() => {
              state.product = data!.find((t) => t.id === p?.value);
            });
          }}
          selected={state.product?.id}
          options={data.map((product) => ({
            label: (
              <>
                {product.months} {t("giveProduct.months")}, $
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
          {t("giveProduct.submitButton")}
        </Button>
      </Panel>
    );
  });
