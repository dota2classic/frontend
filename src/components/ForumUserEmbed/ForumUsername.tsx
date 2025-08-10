import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "@/components/ForumUserEmbed/ForumUserEmbed.module.scss";
import cx from "clsx";

interface IForumUserEmbedProps {
  steamId: string;
}

export const ForumUsername: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId }) => {
    const { user, auth } = useStore();

    return (
      <span className={cx(steamId === auth?.parsedToken?.sub && c.myTag)}>
        @{user.tryGetUser(steamId)?.entry?.user?.name || "Loading..."}
      </span>
    );
  },
);
