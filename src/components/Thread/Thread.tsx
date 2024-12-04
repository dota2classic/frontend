"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Button,
  MarkdownTextarea,
  MessageGroup,
  Pagination,
  Panel,
  ScrollDetector,
} from "..";

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
import { IoSend } from "react-icons/io5";
import { useThrottle } from "@/util/throttle";

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

export const MessageInput = observer(
  (p: {
    threadId: string;
    canMessage: boolean;
    onMessage: (mgs: ThreadMessageDTO) => void;
    rows: number;
    className?: string;
  }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isValid = value.trim().length >= 2;

    const throttledSubmit = useThrottle(() => {
      if (!isValid) {
        setError("Слишком короткое сообщение!");
        return;
      }
      // Do it optimistically, first
      const msg = value;
      setValue("");

      getApi()
        .forumApi.forumControllerPostMessage({
          threadId: p.threadId,
          content: msg,
        })
        .then((msg) => {
          setValue("");
          p.onMessage(msg);
        })
        .catch((err) => {
          if (err.status === 403) {
            setError("Вам запрещено отправлять сообщения!");
          } else {
            setError("Слишком часто отправляете сообщения!");
          }
          setValue(msg);
        });
    }, 250);

    const onEnterKeyPressed = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          // enter
          throttledSubmit();
        }
      },
      [throttledSubmit],
    );
    return (
      <Panel className={cx(c.createMessage, p.className)}>
        <MarkdownTextarea
          rows={p.rows}
          readOnly={!p.canMessage}
          onKeyDown={onEnterKeyPressed}
          className={c.text}
          placeholder={
            p.canMessage
              ? "Введите сообщение"
              : "У вас нет прав на отправку сообщений"
          }
          value={value}
          onChange={(e) => {
            setError(null);
            setValue(e.target.value!);
          }}
        />

        {/*<div className={c.markdown}>Поддерживается разметка markdown</div>*/}
        <Button
          disabled={!isValid || !p.canMessage}
          className={(error && "red") || undefined}
          onClick={throttledSubmit}
        >
          {/*{error || "Отправить"}*/}
          {
            <IoSend
              className={error ? "red" : undefined}
              onClick={throttledSubmit}
            />
          }
        </Button>
        <div className={cx(c.test, error && c.visible)}>{error || ""}</div>
      </Panel>
    );
  },
);
export const Thread: React.FC<IThreadProps> = observer(function ThreadInner({
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

  useEffect(() => {
    if (messages.length > 0 && scrollToLast) {
      const element = scrollableRef.current;
      if (!element) return;

      element.scroll({ top: element.scrollHeight + 100, behavior: "instant" });
    }
  }, [messages, scrollToLast, scrollableRef]);

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
