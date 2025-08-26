import React, { ReactNode, useLayoutEffect } from "react";
import { Button, GenericModal } from "@/components";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ReceiveSubscriptionModal.module.scss";
import cx from "clsx";
import { useTranslation } from "react-i18next";

interface IReceiveSubscriptionModalProps {
  onAcknowledge: () => void;
  onClose: () => void;
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
  observer(({ onAcknowledge, imageSize, title, item, action, onClose }) => {
    const { t } = useTranslation();
    const { auth } = useStore();
    const steamId = auth.parsedToken?.sub;

    useLayoutEffect(() => {
      onAcknowledge();
    }, [onAcknowledge]);

    if (!steamId) {
      return null;
    }

    return (
      <GenericModal className={c.modal} title="" onClose={onClose}>
        <h3 className={"shinyText"}>
          {t("receive_subscription_modal.title", { title })}
        </h3>
        <img
          className={cx(imageSize === "small" ? c.small : c.big)}
          src={item.image}
          alt=""
        />
        <h4 className={item.className}>
          {t("receive_subscription_modal.itemName", { name: item.name })}
        </h4>

        <Button onClick={onClose} pageLink={action.link} mega>
          {t("receive_subscription_modal.actionLabel", { label: action.label })}
        </Button>
      </GenericModal>
    );
  });
