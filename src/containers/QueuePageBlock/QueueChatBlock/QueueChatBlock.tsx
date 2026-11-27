import React from "react";

import c from "./QueueChatBlock.module.scss";
import { Thread } from "@/containers/Thread";
import { ThreadType } from "@/api/mapped-models";
import { useTranslation } from "react-i18next";
import { SectionBlock } from "@/components/SectionBlock";
import { OnlineDataHeader } from "@/containers/QueuePageBlock/QueueChatBlock/OnlineDataHeader";

import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { isSecretQueueBan } from "@/util/queue-ban";

export const QueueChatBlock: React.FC = observer(() => {
  const { t } = useTranslation();
  const { auth } = useStore();
  const banned = auth.isAuthorized && isSecretQueueBan(auth.me?.banStatus);
  const threadId = banned
    ? "secret-queue-chat"
    : "17aa3530-d152-462e-a032-909ae69019ed";

  return (
    <SectionBlock
      title={t("queue_page.section.chat")}
      actions={<OnlineDataHeader />}
    >
      {(!auth.isAuthorized || auth.me) && (
        <Thread
          key={threadId}
          className={c.queueDiscussion}
          id={threadId}
          reportsEnabled={!banned}
          threadType={ThreadType.FORUM}
        />
      )}
    </SectionBlock>
  );
});
