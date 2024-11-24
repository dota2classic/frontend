import React from "react";

import c from "./Notifications.module.scss";
import { observer } from "mobx-react-lite";
import { NotificationDto } from "@/store/NotificationStore";
import { useStore } from "@/store";
import cx from "clsx";
import { QueueGameState, useQueueState } from "@/util/useQueueState";

export const Notifications = observer(() => {
  const { notify } = useStore();

  const state = useQueueState();
  const shouldMove = state !== QueueGameState.NO_GAME;
  return (
    <div className={cx(c.container, shouldMove && c.plsMove)}>
      {notify.permanentQueue.map((t: NotificationDto) => (
        <div key={t.id}>{t.text}</div>
      ))}
      {notify.currentPendingNotification && (
        <div className={c.notification}>
          {notify.currentPendingNotification.text}
        </div>
      )}
    </div>
  );
});
