import React from "react";

import { PageLink } from "..";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ForumUserEmbed.module.scss";
import cx from "classnames";

interface IForumUserEmbedProps {
  steamId: string;
}

export const ForumUserEmbed: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId }) => {
    const { user, auth } = useStore();
    return (
      <PageLink
        className={cx(
          c.userEmbed,
          "link",
          steamId === auth?.parsedToken?.sub && c.myTag,
        )}
        link={AppRouter.players.player.index(steamId).link}
      >
        {/*<Image*/}
        {/*  width={30}*/}
        {/*  height={30}*/}
        {/*  src={user.tryGetUser(steamId)?.user?.avatar || "/avatar.png"}*/}
        {/*  alt={`Avatar of user ${steamId}`}*/}
        {/*/>*/}@{user.tryGetUser(steamId)?.entry?.user?.name || "Loading..."}
      </PageLink>
    );
  },
);
