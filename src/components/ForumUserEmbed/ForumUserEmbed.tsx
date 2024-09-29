import React from "react";

import { PageLink } from "..";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ForumUserEmbed.module.scss";

interface IForumUserEmbedProps {
  steamId: string;
}

export const ForumUserEmbed: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId }) => {
    const { user } = useStore();
    return (
      <PageLink
        className={c.userEmbed}
        link={AppRouter.players.player.index(steamId).link}
      >
        <img
          src={user.tryGetUser(steamId)?.avatar}
          alt={`Avatar of user ${steamId}`}
        />
        {user.tryGetUser(steamId)?.name || "Loading..."}
      </PageLink>
    );
  },
);
