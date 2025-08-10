import React from "react";

import { PageLink } from "..";
import { AppRouter } from "@/route";
import c from "./ForumUserEmbed.module.scss";
import cx from "clsx";
import { ForumUsername } from "@/components/ForumUserEmbed/ForumUsername";

interface IForumUserEmbedProps {
  steamId: string;
  nolink?: boolean;
}

export const ForumUserEmbed: React.FC<IForumUserEmbedProps> = ({
  steamId,
  nolink,
}) => {
  return (
    <PageLink
      onClick={(e: React.MouseEvent) => {
        if (!nolink) return;
        e.preventDefault();
      }}
      className={cx(c.userEmbed, "link")}
      link={AppRouter.players.player.index(steamId).link}
    >
      <ForumUsername steamId={steamId} />
    </PageLink>
  );
};
