import React, { useEffect } from "react";

import c from "./Thread.module.scss";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { useStore } from "@/store";
import { ForumThread, MessageInput, Pagination } from "@/components";
import { useThread } from "@/containers/Thread/useThread";
import { ThreadContext } from "./threadContext";
import { ThreadType } from "@/api/mapped-models";
import { ThreadMessageDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { ThreadStyle } from "@/containers/Thread/types";

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
  scrollToLast?: boolean;
  pagination?: {
    pageProvider: (page: number) => NextLinkProp;
    page: number;
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
  const { threads } = useStore();

  useEffect(() => {
    threads.loadEmoticons();
  }, []);

  const thread = useThread(
    id,
    threadType,
    populateMessages,
    (showLastMessages && showLastMessages > 0) || false,
    pagination?.page,
  );

  const displayInput =
    !pagination ||
    !thread.pg ||
    thread.pg.pages === 1 ||
    thread.pg.page == thread.pg.pages - 1;

  useEffect(() => {
    thread.loadOlder();
  }, []);

  return (
    <ThreadContext.Provider
      value={{
        thread,
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
          <ForumThread />
          {/*{threadStyle !== ThreadStyle.CHAT ? (*/}
          {/*  <RenderChatThread thread={thread} messages={messages} />*/}
          {/*) : (*/}
          {/*  <RenderForumThread messages={messages} thread={thread} />*/}
          {/*)}*/}
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
            rows={1}
            canMessage={true}
            threadId={`${thread.threadView.type}_${thread.id}`}
            onMessage={(msg) => thread.consumeMessages([msg])}
          />
        )}
      </div>
    </ThreadContext.Provider>
  );
});
