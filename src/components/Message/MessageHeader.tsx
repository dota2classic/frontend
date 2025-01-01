import { Role } from "@/api/mapped-models";
import {PageLink, PeriodicTimerClient, RichMessage, Tooltipable} from "@/components";
import { MdAdminPanelSettings, MdLocalPolice } from "react-icons/md";
import cx from "clsx";
import c from "@/components/Message/Message.module.scss";
import { AppRouter } from "@/route";
import React from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";

interface IMessageProps {
  message: ThreadMessageDTO;
}

export const MessageHeader = React.memo(
  observer(function MessageHeader({ message }: IMessageProps) {
    const { queue } = useStore();
    const newYear = true;
    const isOnline =
      queue.online.findIndex((x) => x === message.author.steamId) !== -1;

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
        <div
          className={cx(c.contentWrapper__left, c.contentWrapper__left_user)}
        >
          <picture
            className={cx(
              isOnline ? c.online : c.offline,
              newYear && c.newYear,
            )}
          >
            <img
              width={45}
              height={45}
              src={message.author.avatar}
              alt={`Avatar of player ${message.author.name}`}
            />
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
            <span className={c.messageIndex} />
            {<PeriodicTimerClient time={message.createdAt} />}
          </div>
          <div className={cx(c.content)}>
            <MessageTools messageId={message.messageId} />
            <RichMessage rawMsg={message.content} />
          </div>
          <MessageReactions
            messageId={message.messageId}
            reactions={message.reactions}
          />
        </div>
      </div>
    );
  }),
);
