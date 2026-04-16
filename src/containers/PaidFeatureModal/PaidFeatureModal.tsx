import React from "react";
import { Button } from "@/components/Button";
import { GenericModal } from "@/components/GenericModal";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { AppRouter } from "@/route";
import c from "./PaidFeatureModal.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";
import { RiCheckboxCircleFill } from "react-icons/ri";

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
        {[
          t("paid_feature_modal.profileDecorations"),
          t("paid_feature_modal.lobbyCreation"),
          t("paid_feature_modal.avoidedPlayersList"),
          t("paid_feature_modal.recalibration"),
          t("paid_feature_modal.heroChatWheel"),
          t("paid_feature_modal.otherFeatures"),
        ].map((item) => (
          <li key={item}>
            <RiCheckboxCircleFill className={c.checkIcon} />
            {item}
          </li>
        ))}
      </ul>
      <div className={c.buttons}>
        <Button onClick={sub.hide} mega pageLink={AppRouter.store.index.link}>
          {t("paid_feature_modal.interesting")}
        </Button>
      </div>
    </GenericModal>
  );
});
