import React, { useCallback } from "react";

import c from "./Message.module.scss";
import cx from "clsx";
import { ThreadStyle } from "@/components/Thread/types";
import { ThreadMessageDTO, UserDTO } from "@/api/back";
import { MessageHeader } from "@/components/Message/MessageHeader";
import { FollowupMessage } from "@/components/Message/FollowupMessage";

interface MessageGroupProps {
  author: UserDTO;
  messages: ThreadMessageDTO[];
  threadStyle: ThreadStyle;
  onDelete?: (id: string) => void;
  onMute?: (id: string) => void;
}

export const MessageGroup = ({
  messages,
  threadStyle,
  author,
  onDelete,
  onMute,
}: MessageGroupProps) => {
  const firstMsg = messages[0];

  const onMuteWrap = useCallback(
    () => onMute && onMute(author.steamId),
    [author, onDelete],
  );

  return (
    <div
      id={firstMsg.messageId}
      className={cx(
        c.message,
        threadStyle === ThreadStyle.TINY && c.message_tiny,
      )}
    >
      <MessageHeader
        message={firstMsg}
        threadStyle={threadStyle}
        onDelete={onDelete && (() => onDelete(firstMsg.messageId))}
        onMute={onMuteWrap}
      />
      {messages.slice(1).map((message) => (
        <FollowupMessage
          key={message.messageId}
          message={message}
          threadStyle={threadStyle}
          onDelete={onDelete && (() => onDelete(message.messageId))}
          onMute={onMuteWrap}
        />
      ))}
    </div>
  );
};
