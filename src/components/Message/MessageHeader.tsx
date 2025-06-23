import { Role } from "@/api/mapped-models";
import {
  GenericTooltip,
  PageLink,
  PeriodicTimerClient,
  PlayerAvatar,
  Tooltipable,
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
import { ThreadMessageDTO, UserConnectionDtoConnectionEnum } from "@/api/back";
import { MessageContent } from "@/components/Message/MessageContent";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { computed } from "mobx";
import { createPortal } from "react-dom";
import { formatRole } from "@/util/gamemode";
import { FaTwitch } from "react-icons/fa";
import animations from "./ChatIconAnimations.module.scss";

interface IMessageProps {
  message: ThreadMessageDTO;
  lightweight?: boolean;
}

export const MessageHeader = observer(function MessageHeader({
  message,
  lightweight,
}: IMessageProps) {
  const { queue, live } = useStore();
  const [hoveredRole, setHoveredRole] = useState<
    { label: string; ref: HTMLElement } | undefined
  >(undefined);

  const thread = useContext(ThreadContext);

  const isOnline = computed(
    () => queue.online.findIndex((x) => x === message.author.steamId) !== -1,
  ).get();

  const isBeingEdited = computed(
    () => thread.editingMessageId === message.messageId,
  ).get();

  const twitchConnection = message.author.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );

  const liveStream = twitchConnection
    ? live.getLiveStream(message.author.steamId)
    : undefined;

  const chatIconOld = message.author.icon;
  const roleList = message.author.roles.map((t) => t.role);

  const roles = (
    <>
      {hoveredRole &&
        createPortal(
          <GenericTooltip
            anchor={hoveredRole.ref}
            onClose={() => setHoveredRole(undefined)}
          >
            <span className={c.roleTooltip}>{hoveredRole.label}</span>
          </GenericTooltip>,
          document.body,
        )}
      {roleList.includes(Role.MODERATOR) && (
        <MdAdminPanelSettings
          className={"bronze"}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label: formatRole(Role.MODERATOR),
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
      {roleList.includes(Role.ADMIN) && (
        <MdAdminPanelSettings
          className={"grey"}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label: formatRole(Role.ADMIN),
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
      {liveStream && (
        <Tooltipable
          className={"purple"}
          tooltip={`Стримит dotaclassic.ru прямо сейчас!`}
        >
          <a target="__blank" href={liveStream.link}>
            <FaTwitch />
          </a>
        </Tooltipable>
      )}
      {roleList.includes(Role.OLD) && chatIconOld && (
        <img
          src={chatIconOld.image.url}
          className={cx(
            animations.old,
            message.author.chatIconAnimation?.image.key,
          )}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label:
                message.author.title?.title || "Подписчик dotaclassic plus",
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
              user={message.author}
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
