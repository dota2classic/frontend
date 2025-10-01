import React from "react";

import c from "./QueueChatBlock.module.scss";
import { Thread } from "@/containers/Thread";
import { ThreadType } from "@/api/mapped-models";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { OnlineDataHeader } from "@/containers/QueuePageBlock/QueueChatBlock/OnlineDataHeader";

export const QueueChatBlock: React.FC = () => {
  const { t } = useTranslation();

  return (
    <QueuePageBlock
      heading={t("queue_page.section.chat")}
      icons={<OnlineDataHeader />}
    >
      <Thread
        className={c.queueDiscussion}
        id={"17aa3530-d152-462e-a032-909ae69019ed"}
        threadType={ThreadType.FORUM}
      />
    </QueuePageBlock>
  );
};
