"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Button,
  MarkdownTextarea,
  Message,
  Pagination,
  Panel,
  ScrollDetector,
} from "..";

import c from "./Thread.module.scss";
import { ThreadMessageDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "classnames";
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
  id: string | number;
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

//

// const Message: React.FC<IMessageProps> = React.memo(function Message({
//   message,
//   threadStyle,
//   onDelete,
// }: IMessageProps) {
//   const enrichedMessage = enrichMessage(message.content);
//
//   const isDeletable = !!onDelete;
//   const onDeleteWrap = useCallback(
//     () => onDelete && onDelete(message.messageId),
//     [message.messageId, onDelete],
//   );
//
//   const roles = (
//     <>{message.author.roles.includes(Role.ADMIN) && <MdAdminPanelSettings />}</>
//   );
//
//   return (
//     <Panel
//       id={message.messageId}
//       className={cx(c.message, {
//         [c.messageTiny]: threadStyle === ThreadStyle.TINY,
//         [c.messageSmall]: threadStyle === ThreadStyle.SMALL,
//       })}
//     >
//       <div className={cx(c.user)}>
//         <img src={message.author.avatar} alt="" />
//         <span className={c.roles}>{roles}</span>
//         <PageLink
//           link={AppRouter.players.player.index(message.author.steamId).link}
//           className={c.username}
//         >
//           {message.author.name}
//         </PageLink>
//       </div>
//       <div className={c.right}>
//         <div className={c.timeCreated}>
//           <span className={c.usernameWrapper}>
//             <PageLink
//               link={AppRouter.players.player.index(message.author.steamId).link}
//               className={c.username}
//             >
//               {message.author.name}{" "}
//             </PageLink>
//             <span className={c.roles}>{roles}</span>
//           </span>
//
//           <div>
//             #{message.index + 1} Добавлено{" "}
//             {<PeriodicTimerClient time={message.createdAt} />}
//             {isDeletable && (
//               <MdDelete className={c.delete} onClick={onDeleteWrap} />
//             )}
//           </div>
//         </div>
//         <div className={c.content}>{enrichedMessage}</div>
//       </div>
//     </Panel>
//   );
// });

export const MessageInput = observer(
  (p: {
    id: string;
    canMessage: boolean;
    threadType: ThreadType;
    onMessage: (mgs: ThreadMessageDTO) => void;
    rows: number;
    className?: string;
  }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isValid = value.trim().length >= 2;

    // const throttledSubmit = useCallback(
    //   [value, p.id, p.threadType],
    // );

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
          id: p.id,
          content: msg,
          threadType: p.threadType,
        })
        .then((msg) => {
          setValue("");
          p.onMessage(msg);
        })
        .catch(() => {
          setError("Слишком часто отправляете сообщения!");
          setValue(msg);
        });
    }, 250);

    const onEnterKeyPressed = useCallback(
      (e: React.KeyboardEvent) => {
        // if (!isValid || !p.canMessage) {
        //   return;
        // }
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
      ? thread.messages.slice(
          Math.max(0, thread.messages.length - showLastMessages),
        )
      : thread.messages;

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
          <Message
            threadStyle={threadStyle || ThreadStyle.NORMAL}
            message={msg}
            key={msg.messageId}
            onDelete={auth.isAdmin ? deleteMessage : undefined}
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
          id={id.toString()}
          threadType={threadType}
          onMessage={(msg) => consumeMessages([msg])}
        />
      )}
    </div>
  );
});
