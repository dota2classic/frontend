import c from "@/components/Message/Message.module.scss";
import cx from "clsx";
import React, { useContext } from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { MessageContent } from "@/components/Message/MessageContent";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { computed } from "mobx";

interface IMessageProps {
  message: ThreadMessageDTO;
}

export const FollowupMessage = observer(function FollowupMessage({
  message,
}: IMessageProps) {
  const { input } = useContext(ThreadContext);

  const isEdited = computed(
    () => input.editingMessageId === message.messageId,
  ).get();

  return (
    <div
      className={cx(c.contentWrapper, !isEdited && c.contentWrapper_reactions)}
    >
      <div className={cx(c.contentWrapper__left, c.time)}>
        {new Date(message.createdAt).toTimeString().slice(0, 5)}
      </div>
      <div className={cx(c.contentWrapper__middle)}>
        <div className={cx(c.content)}>
          <MessageTools message={message} />
          <MessageContent message={message} />
        </div>
        <MessageReactions
          messageId={message.messageId}
          reactions={message.reactions}
        />
      </div>
    </div>
  );
});
