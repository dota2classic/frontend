import { Role } from "@/api/mapped-models";
import {
  PageLink,
  PeriodicTimerClient,
  PlayerAvatar,
  Tooltipable,
} from "@/components";
import { MdAdminPanelSettings, MdLocalPolice } from "react-icons/md";
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

interface IMessageProps {
  message: ThreadMessageDTO;
  lightweight?: boolean;
}

export const MessageHeader = observer(function MessageHeader({
  message,
  lightweight,
}: IMessageProps) {
  const { queue } = useStore();
  const { input } = useContext(ThreadContext);

  const isOnline = computed(
    () => queue.online.findIndex((x) => x === message.author.steamId) !== -1,
  ).get();

  const isEdited = computed(
    () => input.editingMessageId === message.messageId,
  ).get();

  const roles = (
    <>
      {message.author.roles.includes(Role.ADMIN) && (
        <Tooltipable
          tooltipPosition="top"
          tooltip={"Администратор"}
          className="gold"
        >
          <MdAdminPanelSettings />
        </Tooltipable>
      )}
      {message.author.roles.includes(Role.MODERATOR) && (
        <Tooltipable
          tooltipPosition="top"
          tooltip={"Модератор"}
          className="bronze"
        >
          <MdLocalPolice />
        </Tooltipable>
      )}
    </>
  );

  return (
    <div
      className={cx(
        c.contentWrapper,
        c.header,
        !isEdited && c.contentWrapper_reactions,
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
              src={message.author.avatar}
              alt={`Avatar of player ${message.author.name}`}
            />
          )}
        </picture>
      </div>
      <div className={c.contentWrapper__middle}>
        <div className={cx(c.author)}>
          <PageLink
            link={AppRouter.players.player.index(message.author.steamId).link}
            className={cx(c.username, "link")}
          >
            {message.author.name}
          </PageLink>
          {roles}
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
