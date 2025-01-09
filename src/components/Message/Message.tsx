import React from "react";

import c from "./Message.module.scss";
import cx from "clsx";
import { ThreadMessageDTO } from "@/api/back";
import { FollowupMessage } from "./FollowupMessage";
import { MessageHeader } from "./MessageHeader";
import { RepliedMessage } from "@/components/Message/RepliedMessage";

export const Message = React.memo(function RenderMessageNew({
  message,
  header,
  lightweight,
}: {
  message: ThreadMessageDTO;
  header: boolean;
  lightweight?: boolean;
}) {
  if (header) {
    return (
      <div id={message.messageId} className={cx(c.message, c.message__header)}>
        <RepliedMessage message={message.reply} />
        <MessageHeader message={message} lightweight={lightweight} />
      </div>
    );
  } else {
    return (
      <div id={message.messageId} className={cx(c.message)}>
        <FollowupMessage message={message} />
      </div>
    );
  }
});
