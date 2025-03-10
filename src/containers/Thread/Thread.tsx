import React, { useEffect, useState } from "react";

import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { useStore } from "@/store";
import { MessageInput, RenderChatThread } from "@/components";
import { useThread } from "@/containers/Thread/useThread";
import { ThreadContext } from "./threadContext";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { useThreadControls } from "@/containers/Thread/useThreadControls";
import { ThreadType } from "@/api/mapped-models";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IThreadProps {
  id: string;
  threadType: ThreadType;
  className?: string;
}

export const Thread: React.FC<IThreadProps> = observer(function Thread({
  threadType,
  id,
  className,
}) {
  const [value, setValue] = useState("");
  const { threads } = useStore();

  useEffect(() => {
    threads.loadEmoticons();
  }, []);

  const thread = useThread(id, threadType);

  const [sendMessage, clearReply, canMessage] = useThreadControls(thread);

  const displayInput =
    !thread.pg ||
    thread.pg.pages === 1 ||
    thread.pg.page == thread.pg.pages - 1;

  return (
    <ThreadContext.Provider value={thread}>
      <div className={cx(c.thread, threadFont.className, className)}>
        <div
          className={cx(
            c.messageContainer,
            "messageList",
            c.messageContainer__tiny,
          )}
        >
          <RenderChatThread />
        </div>
        {displayInput && (
          <MessageInput
            value={value}
            setValue={setValue}
            greedyFocus={GreedyFocusPriority.FORUM_SEND_MESSAGE}
            canMessage={canMessage}
            onMessage={sendMessage}
            replyMessage={thread.replyingMessage}
            cancelReply={clearReply}
          />
        )}
      </div>
    </ThreadContext.Provider>
  );
});
