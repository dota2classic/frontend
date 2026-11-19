import { Tooltipable } from "@/components/Tooltipable";
import React from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

export const OnlineDataHeader = observer(() => {
  const { t } = useTranslation();

  const queue = useStore().queue;
  const inGame = queue.inGame;

  if (inGame === undefined) return null;
  return (
    <Tooltipable
      tooltip={t("queue_party_info.onlineStatus", {
        count: inGame,
        onlineCount: queue.online.length,
      })}
    >
      <div>
        <span>
          {t(`queue_party_info.onlineStatusShort`, {
            inGame,
            online: queue.online.length,
          })}
        </span>
      </div>
    </Tooltipable>
  );
});
