import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import React, { useTransition } from "react";
import { Button, Tooltipable } from "@/components";
import c from "@/pages/queue/Queue.module.scss";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const NotificationSetting = observer(() => {
  const { notify } = useStore();
  const { t } = useTranslation();

  const [isPending, startTransition] = useTransition();

  if (!notify.isPushSupported) return null;

  if (!notify.registration) return;

  if (!notify.subscription) {
    return (
      <Tooltipable
        className={c.notify}
        tooltip={t("notification_setting.pushTooltip")}
      >
        <Button onClick={() => startTransition(notify.subscribeToPush)}>
          <span style={{ flex: 1 }}>
            {t("notification_setting.enableNotifications")}
          </span>
          {isPending ? (
            <AiOutlineLoading3Quarters className="loading" />
          ) : (
            <FaBell style={{ float: "right" }} />
          )}
        </Button>
      </Tooltipable>
    );
  }

  return (
    <Button
      className={c.notify}
      onClick={() => startTransition(notify.unsubscribe)}
    >
      <span style={{ flex: 1 }}>
        {t("notification_setting.disableNotifications")}
      </span>
      <FaBell style={{ float: "right" }} />
    </Button>
  );
});
