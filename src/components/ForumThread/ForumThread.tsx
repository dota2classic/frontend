import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Message } from "@/components/";
import { ThreadContext } from "@/containers/Thread/threadContext";
import c from "./RenderForumThread.module.scss";

export const ForumThread: React.FC = observer(function RenderForumThread() {
  const thread = useContext(ThreadContext);

  const pool = thread.pool;

  return (
    <>
      {pool.length === 0 ? (
        <div className={c.empty}>
          Будь первым, кто оставит здесь свое сообщение!
        </div>
      ) : (
        pool.map(([message, header]) => (
          <Message
            key={message.messageId}
            message={message}
            header={header}
            lightweight={false}
          />
        ))
      )}
    </>
  );
});
