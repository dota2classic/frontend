import React, { useMemo } from "react";

import c from "./Message.module.scss";
import cx from "clsx";
import { ThreadMessageDTO } from "@/api/back";
import { FollowupMessage } from "@/components/Message/FollowupMessage";
import { MessageHeader } from "@/components/Message/MessageHeader";

interface MessageGroupProps {
  messages: ThreadMessageDTO[];
}

export const MessageGroup = React.memo(function MessageGroup({
  messages,
}: MessageGroupProps) {
  const firstMsg = useMemo(() => messages[0], [messages]);
  return (
    <div id={firstMsg.messageId} className={cx(c.message)}>
      <MessageHeader message={firstMsg} />
      {messages.slice(1).map((message) => (
        <FollowupMessage key={message.messageId} message={message} />
      ))}
    </div>
  );
});
