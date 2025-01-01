import React from "react";

import { MessageGroup } from "..";
import { GroupedMessages } from "@/containers/Thread/threads";

interface IRenderForumThreadProps {
  messages: GroupedMessages[];
}

export const RenderForumThread = React.memo(function RenderForumThread({
  messages,
}: IRenderForumThreadProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageGroup
          key={message.messages[0].messageId}
          messages={message.messages}
        />
      ))}
    </>
  );
});
