import { PeriodicTimerClient, PlayerAvatar } from "@/components";
import cx from "clsx";
import c from "@/components/Message/Message.module.scss";
import { AppRouter } from "@/route";
import React, { useContext } from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { MessageContent } from "@/components/Message/MessageContent";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { computed } from "mobx";
import { Username } from "../Username/Username";

interface IMessageProps {
  message: ThreadMessageDTO;
  lightweight?: boolean;
}

export const MessageHeader = observer(function MessageHeader({
  message,
  lightweight,
}: IMessageProps) {
  const { queue } = useStore();

  const thread = useContext(ThreadContext);

  const isOnline = computed(
    () => queue.online.findIndex((x) => x === message.author.steamId) !== -1,
  ).get();

  const isBeingEdited = computed(
    () => thread.editingMessageId === message.messageId,
  ).get();

  return (
    <div
      className={cx(
        c.contentWrapper,
        c.header,
        !isBeingEdited && c.contentWrapper_reactions,
      )}
    >
      <div className={cx(c.contentWrapper__left, c.contentWrapper__left_user)}>
        <picture className={cx(c.avatarRoot, isOnline ? c.online : c.offline)}>
          {lightweight ? (
            <span className={c.avatarPlaceholder} />
          ) : (
            <PlayerAvatar
              width={45}
              height={45}
              user={message.author}
              alt={`Avatar of player ${message.author.name}`}
            />
          )}
        </picture>
      </div>
      <div className={c.contentWrapper__middle}>
        <div className={cx(c.author)}>
          <Username
            link={AppRouter.players.player.index(message.author.steamId).link}
            user={message.author}
            className={c.username}
            roles
          />
          <span className={c.messageTime}>
            {<PeriodicTimerClient time={message.createdAt} />}
          </span>
        </div>
        <div className={cx(c.content)}>
          <MessageTools message={message} />
          <MessageContent message={message} />
        </div>
        <MessageReactions
          messageId={message.messageId}
          reactions={message.reactions}
        />
      </div>
    </div>
  );
});
