import React, { useEffect, useState } from "react";

import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { useStore } from "@/store";
import { RenderChatThread } from "@/components/RenderChatThread";
import { useThread } from "./useThread";
import { ThreadContext } from "./threadContext";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { useThreadControls } from "./useThreadControls";
import { ThreadType } from "@/api/mapped-models";
import { threadFont } from "@/const/fonts";
import { MessageInput } from "@/components/MessageInput";
import { Message } from "@/components/Message";

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

  const pinnedMessage = thread.pinnedMessage;

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
          {pinnedMessage && (
            <div className={c.pinnedMessage}>
              <span className={c.pinnedMessage__indicator}>Закреплено</span>
              <Message
                header={true}
                lightweight
                message={{ ...pinnedMessage, reactions: [] }}
              />
            </div>
          )}
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
