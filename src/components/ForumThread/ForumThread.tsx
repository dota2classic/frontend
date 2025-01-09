import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { Message } from "@/components/";

export const ForumThread = observer(function RenderForumThread() {
  const { thread } = useContext(ThreadContext);

  return (
    <>
      {thread.pool.map(([message, header]) => (
        <Message
          key={message.messageId}
          message={message}
          header={header}
          lightweight={false}
        />
      ))}
    </>
  );
});
