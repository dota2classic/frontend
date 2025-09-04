import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import c from "./ForumUserEmbed.module.scss";
import cx from "clsx";
import { useTranslation } from "react-i18next";

interface IForumUserEmbedProps {
  steamId: string;
}

export const ForumUsername: React.FC<IForumUserEmbedProps> = observer(
  ({ steamId }) => {
    const { user, auth } = useStore();
    const { t } = useTranslation();

    return (
      <span className={cx(steamId === auth?.parsedToken?.sub && c.myTag)}>
        @
        {user.tryGetUser(steamId)?.entry?.user?.name || t("forum_user.loading")}
      </span>
    );
  },
);
