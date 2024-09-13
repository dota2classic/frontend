import React from "react";

import c from "./Notifications.module.scss";
import { observer } from "mobx-react-lite";
import { NotificationDto } from "@/store/NotificationStore";
import { useStore } from "@/store";

export const Notifications = observer(() => {
  const { notify } = useStore();

  return (
    <div className={c.container}>
      {notify.permanentQueue.map((t: NotificationDto) => t.text)}
      {notify.currentPendingNotification && (
        <div className={c.notification}>
          {notify.currentPendingNotification.text}
        </div>
      )}
    </div>
  );
});
