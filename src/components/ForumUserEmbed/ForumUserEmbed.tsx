import React from "react";

import { PageLink } from "..";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ForumUserEmbed.module.scss";
import Image from "next/image";
import cx from "classnames";

interface IForumUserEmbedProps {
  steamId: string;
}

export const ForumUserEmbed: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId }) => {
    const { user } = useStore();
    return (
      <PageLink
        className={cx(c.userEmbed, "link")}
        link={AppRouter.players.player.index(steamId).link}
      >
        <Image
          width={30}
          height={30}
          src={user.tryGetUser(steamId)?.user?.avatar || "/avatar.png"}
          alt={`Avatar of user ${steamId}`}
        />
        {user.tryGetUser(steamId)?.user?.name || "Loading..."}
      </PageLink>
    );
  },
);
