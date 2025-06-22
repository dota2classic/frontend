import React from "react";

import { PageLink, PlayerAvatar } from "..";

import c from "./UserPreview.module.scss";
import { UserDTO } from "@/api/back";
import { AppRouter, NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "clsx";
import { computed } from "mobx";

interface IUserPreviewProps {
  user: UserDTO;
  avatarSize?: number;
  nolink?: boolean;
  className?: string;
  link?: NextLinkProp;
}

type DivProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const UserPreview: React.FC<IUserPreviewProps & DivProps> = observer(
  ({ user, avatarSize, nolink, className, link, ...props }) => {
    const { queue } = useStore();
    const isOnline = computed(
      () => queue.online.findIndex((x) => x === user.steamId) !== -1,
    ).get();

    return (
      <div {...props} className={cx(c.user, className)}>
        <picture
          className={isOnline ? c.online : undefined}
          style={{ width: avatarSize || 45, height: avatarSize || 45 }}
        >
          <PlayerAvatar
            width={avatarSize || 45}
            height={avatarSize || 45}
            user={user}
            alt=""
          />
        </picture>
        {nolink ? (
          <span>{user.name}</span>
        ) : (
          <PageLink
            className={"link"}
            link={link || AppRouter.players.player.index(user.steamId).link}
          >
            {Number(user.steamId) > 10 ? user.name : "Бот"}
          </PageLink>
        )}
      </div>
    );
  },
);
