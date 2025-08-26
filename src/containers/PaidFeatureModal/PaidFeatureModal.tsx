import React from "react";
import { Button, GenericModal } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { AppRouter } from "@/route";
import c from "./PaidFeatureModal.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";

export const PaidFeatureModal: React.FC = observer(({}) => {
  const { sub } = useStore();
  const { t } = useTranslation();

  if (!sub.subscriptionVisible) return null;
  return (
    <GenericModal
      className={cx(c.paywall, NotoSans.className)}
      title={t("paid_feature_modal.subscriptionTitle")}
      onClose={sub.hide}
      header={() => <img src="/paywall.webp" alt="" className={c.logo} />}
    >
      <h2 className={TrajanPro.className}>
        {t("paid_feature_modal.subscriptionName")}
      </h2>
      <ul>
        <li>{t("paid_feature_modal.profileDecorations")}</li>
        <li>{t("paid_feature_modal.lobbyCreation")}</li>
        <li>{t("paid_feature_modal.avoidedPlayersList")}</li>
        <li>{t("paid_feature_modal.recalibration")}</li>
        <li>{t("paid_feature_modal.otherFeatures")}</li>
      </ul>
      <div className={c.buttons}>
        <Button onClick={sub.hide} mega pageLink={AppRouter.store.index.link}>
          {t("paid_feature_modal.interesting")}
        </Button>
      </div>
    </GenericModal>
  );
});
