import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { RenderMessageNew } from "@/components/Message/Message";

export const ForumThread = observer(function RenderForumThread() {
  const { thread } = useContext(ThreadContext);

  return (
    <>
      {thread.pool.map(([message, header]) => (
        <RenderMessageNew
          key={message.messageId}
          message={message}
          header={header}
          lightweight={false}
        />
      ))}
    </>
  );
});
