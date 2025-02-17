import React, { useCallback, useEffect, useMemo } from "react";

import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { useStore } from "@/store";
import {
  ForumThread,
  MessageInput,
  Pagination,
  RenderChatThread,
} from "@/components";
import { useThread } from "@/containers/Thread/useThread";
import { ThreadContext } from "./threadContext";
import { ThreadType } from "@/api/mapped-models";
import { ThreadMessageDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { ThreadStyle } from "@/containers/Thread/types";
import { GreedyFocusPriority } from "@/util/useTypingCallback";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IThreadProps {
  id: string;
  threadType: ThreadType;
  className?: string;
  populateMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO;
  threadStyle: ThreadStyle;
  showLastMessages?: number;
  pagination?: {
    pageProvider: (page: number) => NextLinkProp;
    page: number;
    perPage?: number;
  };
}

export const Thread: React.FC<IThreadProps> = observer(function Thread({
  threadType,
  id,
  className,
  populateMessages,
  threadStyle,
  showLastMessages,
  pagination,
}) {
  const { threads, auth } = useStore();

  useEffect(() => {
    threads.loadEmoticons();
  }, []);

  const canMessage: boolean = useMemo(() => {
    return !!auth.parsedToken;
  }, [auth.parsedToken]);

  const { thread, input, ...editInput } = useThread(
    id,
    threadType,
    populateMessages,
    (showLastMessages && showLastMessages > 0) || false,
    pagination?.page,
    pagination?.perPage,
  );

  const sendMessage = useCallback(
    (msg: string) => {
      return thread
        .sendMessage(msg, input.replyingMessageId)
        .then(() => input.setReplyMessageId(undefined));
    },
    [input, thread],
  );

  const clearReply = useCallback(() => {
    input.setReplyMessageId(undefined);
  }, [input]);

  const displayInput =
    !pagination ||
    !thread.pg ||
    thread.pg.pages === 1 ||
    thread.pg.page == thread.pg.pages - 1;

  return (
    <ThreadContext.Provider
      value={{
        thread,
        input,
      }}
    >
      <div className={cx(c.thread, threadFont.className, className)}>
        {pagination && (
          <Pagination
            page={pagination.page}
            maxPage={thread.pg?.pages || 0}
            linkProducer={(page) => pagination!.pageProvider(page)}
          />
        )}
        <div
          className={cx(
            c.messageContainer,
            "messageList",
            threadStyle === ThreadStyle.FORUM && c.messageContainer__forum,
            c.messageContainer__tiny,
          )}
        >
          {threadStyle === ThreadStyle.CHAT ? (
            <RenderChatThread />
          ) : (
            <ForumThread />
          )}
        </div>
        {pagination && (
          <Pagination
            page={pagination.page}
            maxPage={thread.pg?.pages || 0}
            linkProducer={(page) => pagination!.pageProvider(page)}
          />
        )}
        {displayInput && (
          <MessageInput
            greedyFocus={GreedyFocusPriority.FORUM_SEND_MESSAGE}
            canMessage={canMessage}
            onMessage={sendMessage}
            replyMessage={input.replyingMessage}
            cancelReply={clearReply}
          />
        )}
      </div>
    </ThreadContext.Provider>
  );
});
