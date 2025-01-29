import React from "react";

import c from "./Notifications.module.scss";
import { observer } from "mobx-react-lite";
import { PopupNotificationDto } from "@/store/NotificationStore";
import { useStore } from "@/store";
import cx from "clsx";
import { QueueGameState, useQueueState } from "@/util/useQueueState";

export const Notifications = observer(() => {
  const { notify } = useStore();

  const state = useQueueState();
  const shouldMove = state !== QueueGameState.NO_GAME;
  return (
    <div className={cx(c.container, shouldMove && c.plsMove)}>
      {notify.permanentQueue.map((t: PopupNotificationDto) => (
        <div key={t.id}>{t.text}</div>
      ))}
      {notify.currentPendingNotification &&
        notify.currentPendingNotification.text}
    </div>
  );
});
