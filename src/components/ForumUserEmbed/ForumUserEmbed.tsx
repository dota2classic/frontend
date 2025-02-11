import React from "react";

import { PageLink } from "..";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ForumUserEmbed.module.scss";
import cx from "clsx";

interface IForumUserEmbedProps {
  steamId: string;
  nolink?: boolean;
}

export const ForumUserEmbed: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId, nolink }) => {
    const { user, auth } = useStore();
    const RootComponent: React.FC = nolink
      ? (p: never) => React.createElement("a", { ...p, href: "#" })
      : PageLink;

    return (
      <RootComponent
        className={cx(
          c.userEmbed,
          "link",
          steamId === auth?.parsedToken?.sub && c.myTag,
        )}
        link={AppRouter.players.player.index(steamId).link}
      >
        @{user.tryGetUser(steamId)?.entry?.user?.name || "Loading..."}
      </RootComponent>
    );
  },
);
