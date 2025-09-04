import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { StoreLandingSlide } from "./StoreLandingSlide";
import { SubscriptionProductDto } from "@/api/back";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ClientPortal } from "@/components/ClientPortal";
import { BuySubscriptionModal } from "@/components/BuySubscriptionModal";
import { EmbedProps } from "@/components/EmbedProps";

interface Props {
  products: SubscriptionProductDto[];
}
export const StoreLanding = observer(({ products }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  const startPayment = useCallback(() => {
    return router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        checkout: "true",
      },
    });
  }, [router]);

  const endPayment = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checkout, ...rest } = router.query;
    return router.push({
      pathname: router.pathname,
      query: {
        ...rest,
      },
    });
  }, [router]);

  const isCheckout = router.query["checkout"] === "true";

  return (
    <>
      <ClientPortal visible={isCheckout}>
        <BuySubscriptionModal
          products={products}
          onClose={endPayment}
          onPurchase={(product, steamId) => {
            window.open(
              `https://t.me/dotaclassic_payments_bot?start=${steamId}`,
              "__blank",
            );
          }}
        />
      </ClientPortal>

      <EmbedProps
        title={t("store_landing.title")}
        description={t("store_landing.description")}
      />
      <StoreLandingSlide
        heading="h1"
        image="/splash/subscription.webp"
        title={t("store_landing.subscriptionTitle")}
        text={t("store_landing.subscriptionText")}
        onPurchase={startPayment}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/decoration.webp"
        title={t("store_landing.profileDecorationTitle")}
        text={t("store_landing.profileDecorationText")}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/dodge.webp"
        title={t("store_landing.dodgeListTitle")}
        text={t("store_landing.dodgeListText")}
        light
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/unban.webp"
        title={t("store_landing.unbanHeroTitle")}
        text={t("store_landing.unbanHeroText")}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/cm_lina.webp"
        title={t("store_landing.inGamePraiseTitle")}
        text={t("store_landing.inGamePraiseText")}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/mute.webp"
        title={t("store_landing.muteTitle")}
        text={t("store_landing.muteText")}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/lobby.webp"
        title={t("store_landing.lobbyTitle")}
        text={t("store_landing.lobbyText")}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/recalibration.webp"
        title={t("store_landing.recalibrationTitle")}
        text={t("store_landing.recalibrationText")}
        onPurchase={startPayment}
      />
    </>
  );
});
