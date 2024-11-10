import React, { useCallback } from "react";

import {
  PageLink,
  Panel,
  PeriodicTimerClient,
  PlayerAvatar,
  TooltipIcon,
} from "..";

import c from "./Message.module.scss";
import { Role } from "@/api/mapped-models";
import { MdAdminPanelSettings, MdDelete, MdLocalPolice } from "react-icons/md";
import cx from "classnames";
import { ThreadStyle } from "@/components/Thread/types";
import { AppRouter } from "@/route";
import { ThreadMessageDTO } from "@/api/back";
import { enrichMessage } from "@/components/Thread/richMessage";

interface IMessageProps {
  message: ThreadMessageDTO;
  threadStyle: ThreadStyle;
  onDelete?: (id: string) => void;
}

export const Message: React.FC<IMessageProps> = React.memo(function Message({
  message,
  threadStyle,
  onDelete,
}: IMessageProps) {
  const enrichedMessage = enrichMessage(message.content);

  const isDeletable = !!onDelete;
  const onDeleteWrap = useCallback(
    () => onDelete && onDelete(message.messageId),
    [message.messageId, onDelete],
  );

  const roles = (
    <>
      {message.author.roles.includes(Role.ADMIN) && (
        <TooltipIcon tooltip={"Администратор"} className="gold">
          <MdAdminPanelSettings />
        </TooltipIcon>
      )}
      {message.author.roles.includes(Role.MODERATOR) && (
        <TooltipIcon tooltip={"Модератор"}>
          <MdLocalPolice />
        </TooltipIcon>
      )}
    </>
  );

  return (
    <Panel
      id={message.messageId}
      className={cx(c.message, threadStyle === ThreadStyle.TINY && c.tiny)}
    >
      <div className={cx(c.user)}>
        <PlayerAvatar
          width={threadStyle === ThreadStyle.TINY ? 45 : 100}
          height={threadStyle === ThreadStyle.TINY ? 45 : 100}
          src={message.author.avatar}
          alt={`Avatar of player ${message.author.name}`}
        />
        <PageLink
          link={AppRouter.players.player.index(message.author.steamId).link}
          className={cx(c.user__username, "link")}
        >
          {message.author.name}
        </PageLink>
      </div>
      <div className={c.right}>
        <div className={c.heading}>
          <span className={c.heading__left}>
            <PageLink
              link={AppRouter.players.player.index(message.author.steamId).link}
              className={cx(c.heading, "link")}
            >
              {message.author.name}
            </PageLink>
            {roles}
          </span>

          <div className={c.right__timeCreated}>
            <span>#{message.index + 1} Добавлено </span>
            {<PeriodicTimerClient time={message.createdAt} />}
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
