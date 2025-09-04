import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useTranslation } from "react-i18next";
import { ReceiveSubscriptionModal } from "../ReceiveSubscriptionModal";

export const ClaimContainer: React.FC = observer(() => {
  const { t } = useTranslation();
  const { claim, notify } = useStore();

  const first = claim.claimQueue[0];

  const onClose = useCallback(() => {
    if (!first) return;
    notify.acknowledge(first.notificationId).then(claim.pop);
  }, [claim.pop, first, notify]);

  if (!first) return null;

  return (
    <ReceiveSubscriptionModal
      imageSize={"small"}
      onClose={onClose}
      title={first.title}
      onAcknowledge={() => undefined}
      item={{
        image: first.item.image,
        name: first.item.label,
        className: first.item.className,
      }}
      action={{
        label: t(first.action.label),
        link: first.action.link,
      }}
    />
  );
});
