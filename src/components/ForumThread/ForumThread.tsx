import React from "react";
import { Message } from "@/components";
import { GroupedMessages } from "@/containers/Thread/threads";

interface IRenderForumThreadProps {
  messages: GroupedMessages[];
}

export const ForumThread = React.memo(function RenderForumThread({
  messages,
}: IRenderForumThreadProps) {
  return (
    <>
      {messages.map((message) => (
        <Message
          key={message.messages[0].messageId}
          messages={message.messages}
        />
      ))}
    </>
  );
});
