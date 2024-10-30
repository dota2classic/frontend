import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
  ForumUserEmbed,
  MarkdownTextarea,
  PageLink,
  Panel,
  PeriodicTimer,
  ScrollDetector,
} from "..";

import c from "./Thread.module.scss";
import { ThreadMessageDTO } from "@/api/back";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { Rubik } from "next/font/google";
import cx from "classnames";
import { getApi } from "@/api/hooks";
import { useThread } from "@/util/threads";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { useStore } from "@/store";
import { MdDelete } from "react-icons/md";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export enum ThreadStyle {
  NORMAL,
  SMALL,
  TINY,
}

interface IThreadProps {
  id: string | number;
  threadType: ThreadType;
  className?: string;
  populateMessages?: ThreadMessageDTO[];
  threadStyle?: ThreadStyle;
  showLastMessages?: number;
  scrollToLast?: boolean;
}

interface IMessageProps {
  message: ThreadMessageDTO;
  threadStyle: ThreadStyle;
  onDelete?: (id: string) => void;
}

//
function useEnrichedMessage(msg2: string) {
  const msg = msg2.replace(/\n\s*\n/g, "\n");

  const parts: ReactNode[] = [];
  const r = new RegExp(
    `(https:\\/\\/dotaclassic.ru\\/matches\\/(\\d+))|(https:\\/\\/dotaclassic.ru\\/players\\/(\\d+))`,
    "g",
  );
  const matches = Array.from(msg.matchAll(r));

  let prevIdx = 0;
  matches.forEach((match) => {
    const prev = msg.slice(prevIdx, match.index);
    parts.push(prev);

    const atIndex = match.index;

    if (match[4]) {
      // player
      // somehow fetch user?
      const playerId = match[4];
      parts.push(<ForumUserEmbed steamId={playerId} />);
    } else {
      // match
      const matchId = match[2];
      parts.push(
        <PageLink link={AppRouter.matches.match(Number(matchId)).link}>
          Матч {matchId}
        </PageLink>,
      );
    }

    prevIdx = atIndex + match[0].length;
  });

  parts.push(msg.slice(prevIdx));

  return <>{...parts}</>;
}

export const Message: React.FC<IMessageProps> = React.memo(function Message({
  message,
  threadStyle,
  onDelete,
}: IMessageProps) {
  const enrichedMessage = useEnrichedMessage(message.content);

  const isDeletable = !!onDelete;
  const onDeleteWrap = useCallback(
    () => onDelete && onDelete(message.messageId),
    [message.messageId, onDelete],
  );

  return (
    <Panel
      id={message.messageId}
      className={cx(c.message, {
        [c.messageTiny]: threadStyle === ThreadStyle.TINY,
        [c.messageSmall]: threadStyle === ThreadStyle.SMALL,
      })}
    >
      <PageLink
        link={AppRouter.players.player.index(message.author.steamId).link}
        className={c.user}
      >
        <img src={message.author.avatar} alt="" />
        <h4>{message.author.name}</h4>
      </PageLink>
      <div className={c.right}>
        <div className={c.timeCreated}>
          <PageLink
            link={AppRouter.players.player.index(message.author.steamId).link}
            className={c.username}
          >
            {message.author.name}
          </PageLink>
          <div>
            #{message.index + 1} Добавлено{" "}
            {<PeriodicTimer time={message.createdAt} />}
            {isDeletable && (
              <MdDelete className={c.delete} onClick={onDeleteWrap} />
            )}
          </div>
        </div>
        <div className={c.content}>{enrichedMessage}</div>
      </div>
    </Panel>
  );
});

export const MessageInput = observer(
  (p: {
    id: string;
    threadType: ThreadType;
    onMessage: (mgs: ThreadMessageDTO) => void;
  }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isValid = value.length >= 5;

    const submit = () => {
      getApi()
        .forumApi.forumControllerPostMessage({
          id: p.id,
          content: value,
          threadType: p.threadType,
        })
        .then((msg) => {
          setValue("");
          p.onMessage(msg);
        })
        .catch(() => {
          setError("Слишком часто отправляете сообщения!");
        });
    };
    return (
      <Panel className={c.createMessage}>
        <MarkdownTextarea
          className={c.text}
          placeholder={"Введите сообщение"}
          value={value}
          onChange={(e) => {
            setError(null);
            setValue(e.target.value!);
          }}
        />
        {/*<div className={c.markdown}>Поддерживается разметка markdown</div>*/}
        <Button
          disabled={!isValid}
          className={(error && "red") || undefined}
          onClick={submit}
        >
          {error || "Отправить"}
        </Button>
      </Panel>
    );
  },
);
export const Thread: React.FC<IThreadProps> = observer(
  ({
    threadType,
    id,
    className,
    populateMessages,
    threadStyle,
    showLastMessages,
    scrollToLast,
  }) => {
    const { auth } = useStore();
    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const [thread, loadMore, consumeMessages] = useThread(
      id,
      threadType,
      populateMessages,
      (showLastMessages && showLastMessages > 0) || false,
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

        element.scroll({ top: element.scrollHeight + 100, behavior: "smooth" });
      }
    }, [messages, scrollToLast, scrollableRef]);

    const deleteMessage = useCallback(
      (id: string) => {
        if (!auth.isAdmin) return;
        getApi()
          .forumApi.forumControllerDeleteMessage(id)
          .then((data) => consumeMessages([data]));
      },
      [auth.isAdmin, consumeMessages],
    );

    return (
      <div className={cx(c.thread, threadFont.className, className)}>
        <div
          ref={scrollableRef}
          className={cx(c.messageContainer, "messageList")}
        >
          {messages.map((msg) => (
            <Message
              threadStyle={threadStyle || ThreadStyle.NORMAL}
              message={msg}
              key={msg.messageId}
              onDelete={deleteMessage}
            />
          ))}
        </div>
        <ScrollDetector onScrolledTo={loadMore} />
        <MessageInput
          id={id.toString()}
          threadType={threadType}
          onMessage={() => undefined}
        />
      </div>
    );
  },
);
