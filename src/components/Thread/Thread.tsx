import React, { ReactNode, useState } from "react";

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
import { useApi } from "@/api/hooks";
import { useThread } from "@/util/threads";
import { ThreadType } from "@/api/mapped-models/ThreadType";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IThreadProps {
  id: string | number;
  threadType: ThreadType;
  className?: string;
  populateMessages?: ThreadMessageDTO[];
  small?: boolean;
}

interface IMessageProps {
  message: ThreadMessageDTO;
  small?: boolean;
}

//
function useEnrichedMessage(msg2: string) {
  let msg = msg2.replace(/\n\s*\n/g, "\n");

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

export const Message: React.FC<IMessageProps> = React.memo(
  ({ message, small }: IMessageProps) => {
    const enrichedMessage = useEnrichedMessage(message.content);

    return (
      <Panel
        id={message.messageId}
        className={cx(c.message, small && c.messageSmall)}
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
            </div>
          </div>
          <div className={c.content}>{enrichedMessage}</div>
        </div>
      </Panel>
    );
  },
);

export const MessageInput = observer(
  (p: {
    id: string;
    threadType: ThreadType;
    onMessage: (mgs: ThreadMessageDTO) => void;
  }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const submit = () => {
      useApi()
        .forumApi.forumControllerPostMessage({
          id: p.id,
          content: value,
          threadType: p.threadType,
        })
        .then((msg) => {
          setValue("");
          p.onMessage(msg);
        })
        .catch((e) => {
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
        <Button className={(error && "red") || undefined} onClick={submit}>
          {error || "Отправить"}
        </Button>
      </Panel>
    );
  },
);
export const Thread: React.FC<IThreadProps> = ({
  threadType,
  id,
  className,
  populateMessages,
  small,
}) => {
  const [thread, loadMore] = useThread(id, threadType, populateMessages);

  return (
    <div className={cx(c.thread, threadFont.className, className)}>
      <div className={c.messageContainer}>
        {thread.messages.map((msg) => (
          <Message small={small} message={msg} key={msg.messageId} />
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
};
