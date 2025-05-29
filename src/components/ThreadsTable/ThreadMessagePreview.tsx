import { ThreadMessageDTO } from "@/api/back";
import cx from "clsx";
import c from "./ThreadsTable.module.scss";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import { PageLink, PlayerAvatar, TimeAgo } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

export const ThreadMessagePreview = ({
  message,
}: {
  message: ThreadMessageDTO;
}) => {
  const { author } = message;
  return (
    <div className={cx(c.msg, TableClasses.player)}>
      <PlayerAvatar
        user={author}
        className={TableClasses.avatar__small}
        width={30}
        height={30}
        alt={`avatar of user ${author.name}`}
      />
      <div style={{ flex: 1, marginLeft: 2 }}>
        <PageLink
          className={c.block}
          link={AppRouter.players.player.index(message.author.steamId).link}
        >
          {author.name}
        </PageLink>
        <div
          style={{ marginLeft: 6, whiteSpace: "nowrap" }}
          className={cx(c.block)}
        >
          <TimeAgo date={message.createdAt} />
        </div>
      </div>
    </div>
  );
};
