import React, { useMemo } from "react";

import c from "./Message.module.scss";
import cx from "clsx";
import { ThreadMessageDTO } from "@/api/back";
import { FollowupMessage } from "./FollowupMessage";
import { MessageHeader } from "./MessageHeader";
import { RepliedMessage } from "@/components/Message/RepliedMessage";

interface MessageGroupProps {
  messages: ThreadMessageDTO[];
}

// export const Message = React.memo(function Message({
//   messages,
// }: MessageGroupProps) {
//   const firstMsg = useMemo(() => messages[0], [messages]);
//
//
//   return (
//     <div id={firstMsg.messageId} className={cx(c.message)}>
//       <MessageHeader message={firstMsg} />
//       {messages.slice(1).map((message) => (
//         <FollowupMessage key={message.messageId} message={message} />
//       ))}
//     </div>
//   );
// });

export const Message = ({ messages }: MessageGroupProps) => {
  const firstMsg = useMemo(() => messages[0], [messages]);

  return (
    <div id={firstMsg.messageId} className={cx(c.message)}>
      <RepliedMessage message={firstMsg.reply} />
      <MessageHeader message={firstMsg} />
      {messages.slice(1).map((message) => (
        <FollowupMessage key={message.messageId} message={message} />
      ))}
    </div>
  );
};
