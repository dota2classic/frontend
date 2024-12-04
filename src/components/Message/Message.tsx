import React, { useCallback } from "react";

import { PageLink, PeriodicTimerClient, PlayerAvatar, Tooltipable } from "..";

import c from "./Message.module.scss";
import { Role } from "@/api/mapped-models";
import {
  MdAdminPanelSettings,
  MdDelete,
  MdLocalPolice,
  MdVolumeMute,
} from "react-icons/md";
import cx from "clsx";
import { ThreadStyle } from "@/components/Thread/types";
import { AppRouter } from "@/route";
import { ThreadMessageDTO, UserDTO } from "@/api/back";
import { enrichMessage } from "@/components/Thread/richMessage";

interface IMessageProps {
  message: ThreadMessageDTO;
  threadStyle: ThreadStyle;
  onDelete?: () => void;
  onMute?: () => void;
}

export interface MessageGroupProps {
  author: UserDTO;
  messages: ThreadMessageDTO[];
  threadStyle: ThreadStyle;
  onDelete?: (id: string) => void;
  onMute?: (id: string) => void;
}

interface MessageControlsProps {
  onMute?: () => void;
  onDelete?: () => void;
}
const MessageControls = ({ onDelete, onMute }: MessageControlsProps) => {
  const isDeletable = !!onDelete;

  return (
    <div className={c.controls}>
      {isDeletable && <MdDelete className={c.delete} onClick={onDelete} />}
      {isDeletable && <MdVolumeMute className={c.delete} onClick={onMute} />}
    </div>
  );
};

const MessageHeader = ({
  message,
  threadStyle,
  onDelete,
  onMute,
}: IMessageProps) => {
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
    <div className={cx(c.contentWrapper, c.header)}>
      <div className={cx(c.contentWrapper__left, c.contentWrapper__left_user)}>
        <PlayerAvatar
          width={threadStyle === ThreadStyle.TINY ? 45 : 100}
          height={threadStyle === ThreadStyle.TINY ? 45 : 100}
          src={message.author.avatar}
          alt={`Avatar of player ${message.author.name}`}
        />
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
          <span className={c.messageIndex}>#{message.index + 1} </span>
          {<PeriodicTimerClient time={message.createdAt} />}
        </div>
        <div className={cx(c.content)}>{enrichMessage(message.content)}</div>
      </div>

      <MessageControls onMute={onMute} onDelete={onDelete} />
    </div>
  );
};

const FollowupMessage = ({ message, onDelete, onMute }: IMessageProps) => {
  return (
    <div className={c.contentWrapper}>
      <div className={cx(c.contentWrapper__left, c.time)}>
        {new Date(message.createdAt).toTimeString().slice(0, 5)}
      </div>
      <div className={c.contentWrapper__middle}>
        <div className={cx(c.content)}>{enrichMessage(message.content)}</div>
      </div>

      <MessageControls onMute={onMute} onDelete={onDelete} />
    </div>
  );
};

export const MessageGroup = ({
  messages,
  threadStyle,
  author,
  onDelete,
  onMute,
}: MessageGroupProps) => {
  const firstMsg = messages[0];

  const onMuteWrap = useCallback(
    () => onMute && onMute(author.steamId),
    [author, onDelete],
  );

  return (
    <div
      id={firstMsg.messageId}
      className={cx(
        c.message,
        threadStyle === ThreadStyle.TINY && c.message_tiny,
      )}
    >
      <MessageHeader
        message={firstMsg}
        threadStyle={threadStyle}
        onDelete={onDelete && (() => onDelete(firstMsg.messageId))}
        onMute={onMuteWrap}
      />
      {messages.slice(1).map((message) => (
        <FollowupMessage
          key={message.messageId}
          message={message}
          threadStyle={threadStyle}
          onDelete={onDelete && (() => onDelete(message.messageId))}
          onMute={onMuteWrap}
        />
      ))}
    </div>
  );
};
