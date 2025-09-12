import React from "react";

import c from "./QueueChatBlock.module.scss";
import { Thread } from "@/containers/Thread";
import { ThreadType } from "@/api/mapped-models";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { useStore } from "@/store";
import { computed } from "mobx";
import { Tooltipable } from "@/components/Tooltipable";

export const QueueChatBlock: React.FC = () => {
  const { t } = useTranslation();

  const queue = useStore().queue;
  const onlineData = computed(() => queue.onlineData).get();

  return (
    <QueuePageBlock
      title={t("queue_page.section.chat")}
      icons={
        onlineData ? (
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
        ) : undefined
      }
    >
      <Thread
        className={c.queueDiscussion}
        id={"17aa3530-d152-462e-a032-909ae69019ed"}
        threadType={ThreadType.FORUM}
      />
    </QueuePageBlock>
  );
};
