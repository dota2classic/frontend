import React, { useCallback, useState } from "react";

import c from "./Message.module.scss";
import cx from "clsx";
import { ThreadMessageDTO } from "@/api/back";
import { FollowupMessage } from "./FollowupMessage";
import { MessageHeader } from "./MessageHeader";
import { RepliedMessage } from "@/components/Message/RepliedMessage";
import { BlockedMessage } from "@/components/Message/BlockedMessage";

export const Message = React.memo(function RenderMessageNew({
  message,
  header,
  lightweight,
}: {
  message: ThreadMessageDTO;
  header: boolean;
  lightweight?: boolean;
}) {
  const [showBlocked, setShowBlocked] = useState(false);
  const clearBlocked = useCallback(() => {
    setShowBlocked(true);
  }, []);
  if (message.blocked && !showBlocked) {
    return (
      <div id={message.messageId} className={cx(c.message, c.message__header)}>
        <BlockedMessage onShowBlockedMessage={clearBlocked} />
      </div>
    );
  }

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
