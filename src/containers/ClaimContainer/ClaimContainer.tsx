import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ReceiveSubscriptionModal } from "@/containers";
import { AppRouter, NextLinkProp } from "@/route";
import { ClaimType } from "@/store/ClaimItemStore";

export const ClaimContainer: React.FC = observer(() => {
  const { claim, notify, auth } = useStore();

  const first = claim.claimQueue[0];

  const onClose = useCallback(() => {
    if (!first) return;
    notify.acknowledge(first.notificationId).then(claim.pop);
  }, [claim.pop, first, notify]);

  if (!first) return null;

  let link: NextLinkProp;
  switch (first.type) {
    case ClaimType.SUBSCRIPTION:
      link = auth.parsedToken
        ? AppRouter.players.player.settings(auth.parsedToken.sub).link
        : AppRouter.queue.link;
  }

  return (
    <ReceiveSubscriptionModal
      onClose={onClose}
      title="Подписка приобретена!"
      onAcknowledge={() => undefined}
      item={{
        image: first.item.image,
        name: first.item.label,
      }}
      action={{
        label: first.action.label,
        link,
      }}
    />
  );
});
