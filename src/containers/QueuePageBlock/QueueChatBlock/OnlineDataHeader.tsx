import { Tooltipable } from "@/components/Tooltipable";
import React from "react";
import { useStore } from "@/store";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

export const OnlineDataHeader = observer(() => {
  const { t } = useTranslation();

  const queue = useStore().queue;
  const onlineData = computed(() => queue.onlineData).get();

  if (!onlineData) return null;
  return (
    <Tooltipable
      tooltip={t("queue_party_info.onlineStatus", {
        count: onlineData.inGame,
        onlineCount: queue.online.length,
      })}
    >
      <div>
        <span>
          {t(`queue_party_info.onlineStatusShort`, {
            inGame: onlineData.inGame,
            online: queue.online.length,
          })}
        </span>
      </div>
    </Tooltipable>
  );
});
