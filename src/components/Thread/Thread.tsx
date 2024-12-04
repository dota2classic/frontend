import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MessageGroup, Pagination, ScrollDetector } from "..";

import c from "./Thread.module.scss";
import { ThreadMessageDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { getApi } from "@/api/hooks";
import { useThread } from "@/util/threads";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { useStore } from "@/store";
import { ThreadStyle } from "@/components/Thread/types";
import { MessageInput } from "@/components/Thread/MessageInput";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IThreadProps {
  id: string;
  threadType: ThreadType;
  className?: string;
  populateMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO;
  threadStyle?: ThreadStyle;
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
  scrollToLast,
  pagination,
}) {
  const { auth } = useStore();
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [sticky, setSticky] = useState(!!scrollToLast);
  const [lastSeenMessageIndex, setLastSeenMessageIndex] = useState<
    number | undefined
  >(undefined);

  const [thread, rawThread, loadMore, consumeMessages, pg] = useThread(
    id,
    threadType,
    populateMessages,
    (showLastMessages && showLastMessages > 0) || false,
    pagination?.page,
    showLastMessages,
  );

  const messages =
    showLastMessages !== undefined
      ? thread.groupedMessages.slice(
          Math.max(0, thread.groupedMessages.length - showLastMessages),
        )
      : thread.groupedMessages;

  const unseenMessageCount = useMemo(() => {
    return sticky || lastSeenMessageIndex === undefined
      ? 0
      : messages
          .flatMap((group) => group.messages)
          .filter((message) => message.index > lastSeenMessageIndex).length;
  }, [lastSeenMessageIndex, messages, sticky]);

  const scrollToBottom = useCallback(
    (smooth?: boolean) => {
      const element = scrollableRef.current;
      if (!element) return;
      element.scroll({
        top: element.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
    },
    [scrollableRef],
  );

  useEffect(() => {
    if (!sticky) return;

    if (messages.length > 0 && scrollToLast) {
      scrollToBottom();

      const m = messages[messages.length - 1].messages;
      setLastSeenMessageIndex(m[m.length - 1].index);
    }
  }, [messages, sticky]);

  useEffect(() => {
    const t = scrollableRef.current;
    if (!t) return;

    const listener = () => {
      const sticked =
        Math.abs(t.scrollHeight - t.scrollTop - t.offsetHeight) < 10;
      setSticky(sticked);
    };
    t.addEventListener("scrollend", listener);
    return () => t.removeEventListener("scrollend", listener);
  }, [scrollableRef]);

  const deleteMessage = useCallback(
    (id: string) => {
      getApi()
        .forumApi.forumControllerDeleteMessage(id)
        .then((data) => consumeMessages([data]));
    },
    [consumeMessages],
  );

  const muteUser = useCallback(
    (steamId: string) => {
      // I don't like it but 6 hrs for now
      getApi().forumApi.forumControllerUpdateUser(steamId, {
        muteUntil: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 6,
        ).toISOString(),
      });
    },
    [consumeMessages],
  );

  const displayInput =
    !pagination || !pg || pg.pages === 1 || pg.page == pg.pages - 1;

  const hasRightToMessage =
    auth.isAuthorized && (!rawThread?.adminOnly || auth.isAdmin);

  return (
    <div className={cx(c.thread, threadFont.className, className)}>
      {pagination && (
        <Pagination
          page={pagination.page}
          maxPage={pg?.pages || 0}
          linkProducer={(page) => pagination!.pageProvider(page)}
        />
      )}
      <div
        ref={scrollableRef}
        className={cx(
          c.messageContainer,
          "messageList",
          threadStyle === ThreadStyle.TINY && c.messageContainer__tiny,
        )}
      >
        {messages.map((msg) => (
          <MessageGroup
            threadStyle={threadStyle || ThreadStyle.NORMAL}
            messages={msg.messages}
            key={msg.messages[0].messageId}
            onDelete={auth.isAdmin ? deleteMessage : undefined}
            onMute={auth.isAdmin ? muteUser : undefined}
            author={msg.author}
          />
        ))}
      </div>
      <div
        className={cx(
          c.unseenMessages,
          unseenMessageCount && c.unseenMessages__visible,
        )}
        onClick={() => scrollToBottom(true)}
      >
        {unseenMessageCount} новых сообщений
      </div>
      {!pagination && <ScrollDetector onScrolledTo={loadMore} />}
      {pagination && (
        <Pagination
          page={pagination.page}
          maxPage={pg?.pages || 0}
          linkProducer={(page) => pagination!.pageProvider(page)}
        />
      )}
      {displayInput && (
        <MessageInput
          className={
            threadStyle === ThreadStyle.TINY ? c.createMessage_tiny : undefined
          }
          rows={
            (threadStyle || ThreadStyle.NORMAL) === ThreadStyle.NORMAL
              ? 4
              : threadStyle === ThreadStyle.SMALL
                ? 3
                : 2
          }
          canMessage={hasRightToMessage}
          threadId={`${thread.type}_${thread.id}`}
          onMessage={(msg) => consumeMessages([msg])}
        />
      )}
    </div>
  );
});
