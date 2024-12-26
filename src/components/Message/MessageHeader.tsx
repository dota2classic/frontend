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
import { ThreadStyle } from "@/components/Thread/types";
import { AppRouter } from "@/route";
import { MessageControls } from "@/components/Message/MessageControls";
import { IMessageProps } from "@/components/Message/MessageProps";
import { enrichMessage } from "@/components/Thread/richMessage";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useContext } from "react";
import { ThemeContext } from "@/util/theme";

export const MessageHeader = observer(function MessageHeader({
  message,
  threadStyle,
  onDelete,
  onMute,
}: IMessageProps) {
  const { queue } = useStore();
  const { newYear } = useContext(ThemeContext);
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
      <div className={cx(c.contentWrapper__left, c.contentWrapper__left_user)}>
        <picture
          className={cx(isOnline ? c.online : c.offline, newYear && c.newYear)}
        >
          <PlayerAvatar
            width={threadStyle === ThreadStyle.TINY ? 45 : 100}
            height={threadStyle === ThreadStyle.TINY ? 45 : 100}
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
        <div className={cx(c.content)}>{enrichMessage(message.content)}</div>
      </div>
      <MessageControls onMute={onMute} onDelete={onDelete} />
    </div>
  );
});
