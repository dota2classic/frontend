import React, { ReactNode, useLayoutEffect } from "react";
import { Button } from "@/components/Button";
import { GenericModal } from "@/components/GenericModal";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import c from "./ReceiveSubscriptionModal.module.scss";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { ClaimType } from "@/store/ClaimItemStore";
import { RiGiftLine, RiVipCrown2Line } from "react-icons/ri";

interface IReceiveSubscriptionModalProps {
  onAcknowledge: () => void;
  onClose: () => void;
  type: ClaimType;
  title: ReactNode;
  imageSize: "small" | "big";
  item: {
    image: string;
    name: ReactNode;
    className?: string;
  };
  action: {
    link: NextLinkProp;
    label: ReactNode;
  };
}

export const ReceiveSubscriptionModal: React.FC<IReceiveSubscriptionModalProps> =
  observer(
    ({ onAcknowledge, imageSize, title, type, item, action, onClose }) => {
      const { t } = useTranslation();

      useLayoutEffect(() => {
        onAcknowledge();
      }, [onAcknowledge]);

      const isSubscription = type === ClaimType.SUBSCRIPTION;

      return (
        <GenericModal className={c.modal} title="" onClose={onClose}>
          <div className={c.hero}>
            <span className={c.eyebrow}>
              {isSubscription ? <RiVipCrown2Line /> : <RiGiftLine />}
              {t("receive_subscription_modal.eyebrow")}
            </span>
            <h3 className={c.title}>
              {t("receive_subscription_modal.title", { title })}
            </h3>
            <p className={c.description}>
              {t(
                isSubscription
                  ? "receive_subscription_modal.subscriptionBody"
                  : "receive_subscription_modal.dropBody",
              )}
            </p>
          </div>

          <section className={c.rewardCard}>
            <div className={c.mediaFrame}>
              <img
                className={cx(
                  c.itemImage,
                  imageSize === "small" ? c.small : c.big,
                )}
                src={item.image}
                alt=""
              />
            </div>
            <div className={c.rewardMeta}>
              <span className={c.rewardLabel}>
                {t("receive_subscription_modal.rewardLabel")}
              </span>
              <h4 className={cx(c.itemName, item.className)}>
                {t("receive_subscription_modal.itemName", { name: item.name })}
              </h4>
            </div>
          </section>

          <Button
            className={c.actionButton}
            onClick={onClose}
            pageLink={action.link}
            mega
          >
            {t("receive_subscription_modal.actionLabel", {
              label: action.label,
            })}
          </Button>

          <p className={c.actionHint}>
            {t(
              isSubscription
                ? "receive_subscription_modal.subscriptionHint"
                : "receive_subscription_modal.dropHint",
            )}
          </p>
        </GenericModal>
      );
    },
  );
