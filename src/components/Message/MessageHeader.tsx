import { PeriodicTimerClient, PlayerAvatar } from "@/components";
import cx from "clsx";
import c from "@/components/Message/Message.module.scss";
import { AppRouter } from "@/route";
import React, { useContext } from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { MessageContent } from "@/components/Message/MessageContent";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { computed } from "mobx";
import { Username } from "../Username/Username";
import { useTranslation } from "react-i18next";

interface IMessageProps {
  message: ThreadMessageDTO;
  lightweight?: boolean;
}

export const MessageHeader = observer(function MessageHeader({
  message,
  lightweight,
}: IMessageProps) {
  const { t } = useTranslation();

  const thread = useContext(ThreadContext);

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
        {lightweight ? (
          <span className={c.avatarPlaceholder} />
        ) : (
          <PlayerAvatar
            width={45}
            height={45}
            user={message.author}
            alt={t("message.avatarAlt", { playerName: message.author.name })}
          />
        )}
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
