import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ReceiveSubscriptionModal } from "@/containers";
import { ClaimType } from "@/store/ClaimItemStore";

export const ClaimContainer: React.FC = observer(() => {
  const { claim, notify } = useStore();

  const first = claim.claimQueue[0];

  const onClose = useCallback(() => {
    if (!first) return;
    notify.acknowledge(first.notificationId).then(claim.pop);
  }, [claim.pop, first, notify]);

  if (!first) return null;

  return (
    <ReceiveSubscriptionModal
      imageSize={first.type === ClaimType.SUBSCRIPTION ? "small" : "big"}
      onClose={onClose}
      title={first.title}
      onAcknowledge={() => undefined}
      item={{
        image: first.item.image,
        name: first.item.label,
      }}
      action={{
        label: first.action.label,
        link: first.action.link,
      }}
    />
  );
});
