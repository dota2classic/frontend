import React from "react";
import { PlayerAvatar } from "..";
import c from "./UserPreview.module.scss";
import { UserDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "clsx";
import { computed } from "mobx";
import { Username } from "../Username/Username";

interface IUserPreviewProps {
  user: UserDTO;
  avatarSize?: number;
  nolink?: boolean;
  className?: string;
  link?: NextLinkProp;
  block?: boolean;
}

type DivProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const UserPreview: React.FC<IUserPreviewProps & DivProps> = observer(
  ({ user, avatarSize, nolink, className, link, block, ...props }) => {
    const { queue } = useStore();
    const isOnline = computed(
      () => queue.online.findIndex((x) => x === user.steamId) !== -1,
    ).get();

    return (
      <div {...props} className={cx(c.user, block ? c.block : undefined, className)}>
        <div>
          <picture
            className={isOnline ? c.online : undefined}
            style={{ width: avatarSize || 45, height: avatarSize || 45 }}
          >
            <PlayerAvatar
              width={avatarSize || 45}
              height={avatarSize || 45}
              user={user}
              alt=""
              link={link}
            />
          </picture>
        </div>
        <Username 
          user={user} 
          link={link} 
          nolink={nolink}
          block={block} />
      </div>
    );
  },
);
