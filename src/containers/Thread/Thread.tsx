import React, { useEffect, useState } from "react";

import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { useStore } from "@/store";
import { MessageInput, RenderChatThread } from "@/components";
import { useThread } from "@/containers/Thread/useThread";
import { ThreadContext } from "./threadContext";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { useThreadControls } from "@/containers/Thread/useThreadControls";
import { ThreadType } from "@/api/mapped-models";
import { threadFont } from "@/const/fonts";

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

  const displayInput = true;

  return (
    <ThreadContext.Provider value={thread}>
      <div
        className={cx(
          c.thread,
          threadFont.className,
          "onboarding-chat-window",
          className,
        )}
      >
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
