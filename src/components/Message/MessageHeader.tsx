import { Role } from "@/api/mapped-models";
import {
  GenericTooltip,
  PageLink,
  PeriodicTimerClient,
  PlayerAvatar,
} from "@/components";
import { MdAdminPanelSettings } from "react-icons/md";
import cx from "clsx";
import c from "@/components/Message/Message.module.scss";
import { AppRouter } from "@/route";
import React, { useContext, useState } from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { MessageContent } from "@/components/Message/MessageContent";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { computed } from "mobx";
import { createPortal } from "react-dom";
import { GiAngelOutfit } from "react-icons/gi";
import { formatRole } from "@/util/gamemode";

interface IMessageProps {
  message: ThreadMessageDTO;
  lightweight?: boolean;
}

export const MessageHeader = observer(function MessageHeader({
  message,
  lightweight,
}: IMessageProps) {
  const { queue } = useStore();
  const [hoveredRole, setHoveredRole] = useState<
    { role: Role; ref: HTMLElement } | undefined
  >(undefined);

  const thread = useContext(ThreadContext);

  const isOnline = computed(
    () => queue.online.findIndex((x) => x === message.author.steamId) !== -1,
  ).get();

  const isBeingEdited = computed(
    () => thread.editingMessageId === message.messageId,
  ).get();

  const roles = (
    <>
      {hoveredRole &&
        createPortal(
          <GenericTooltip
            anchor={hoveredRole.ref}
            onClose={() => setHoveredRole(undefined)}
          >
            <span className={c.roleTooltip}>
              {formatRole(hoveredRole.role)}
            </span>
          </GenericTooltip>,
          document.body,
        )}
      {message.author.roles.includes(Role.ADMIN) && (
        <MdAdminPanelSettings
          onMouseEnter={(e) =>
            setHoveredRole({ ref: e.target as HTMLElement, role: Role.ADMIN })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
      {message.author.roles.includes(Role.OLD) && (
        <GiAngelOutfit
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              role: Role.OLD,
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
    </>
  );

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
