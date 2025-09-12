import React from "react";

import c from "./QueueChatBlock.module.scss";
import { Thread } from "@/containers/Thread";
import { ThreadType } from "@/api/mapped-models";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const QueueChatBlock: React.FC = () => {
  const { t } = useTranslation();
  return (
    <QueuePageBlock title={t("queue_page.section.chat")}>
      <Thread
        className={c.queueDiscussion}
        id={"17aa3530-d152-462e-a032-909ae69019ed"}
        threadType={ThreadType.FORUM}
      />
    </QueuePageBlock>
  );
};
