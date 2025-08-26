import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import { usePaginatedThread } from "@/containers/Thread/useThread";
import { ThreadContext } from "@/containers/Thread/threadContext";
import cx from "clsx";
import c from "@/containers/Thread/Thread.module.scss";
import { ForumThread, MessageInput, Pagination } from "@/components";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { ThreadType } from "@/api/mapped-models";
import { ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { Rubik } from "next/font/google";
import { useThreadControls } from "@/containers/Thread/useThreadControls";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

type PaginatedThreadProps = {
  id: string;
  threadType: ThreadType;
  className?: string;
  populateMessages: ThreadMessagePageDTO;
  pagination: {
    pageProvider: (page: number) => NextLinkProp | (() => void);
    page: number;
    perPage?: number;
  };
};

export const PaginatedThread: React.FC<PaginatedThreadProps> = observer(
  function PaginatedThread({
    threadType,
    id,
    className,
    populateMessages,
    pagination,
  }) {
    const [value, setValue] = useState("");
    const { threads } = useStore();

    useEffect(() => {
      threads.loadEmoticons();
    }, []);

    const thread = usePaginatedThread(
      id,
      threadType,
      populateMessages,
      pagination,
    );

    const [sendMessage, clearReply, canMessage] = useThreadControls(thread);

    const displayInput =
      !pagination ||
      !thread.pg ||
      thread.pg.pages <= 1 ||
      thread.pg.page == thread.pg.pages - 1;

    return (
      <ThreadContext.Provider value={thread}>
        <div className={cx(c.thread, threadFont.className, className)}>
          <Pagination
            page={pagination.page}
            maxPage={thread.pg?.pages || 0}
            linkProducer={(page) => pagination!.pageProvider(page)}
          />
          <div
            className={cx(
              c.messageContainer,
              "messageList",
              c.messageContainer__forum,
              c.messageContainer__tiny,
            )}
          >
            <ForumThread />
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
  },
);
