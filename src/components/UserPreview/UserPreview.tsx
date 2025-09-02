import React from "react";
import { PlayerAvatar } from "..";
import c from "./UserPreview.module.scss";
import { UserDTO } from "@/api/back";
import { NextLinkProp } from "@/route";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { Username } from "../Username/Username";

interface IUserPreviewProps {
  user: UserDTO;
  avatarSize?: number;
  nolink?: boolean;
  className?: string;
  link?: NextLinkProp;
  roles?: boolean;
}

type DivProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const UserPreview: React.FC<IUserPreviewProps & DivProps> = observer(
  ({ user, avatarSize, nolink, className, link, roles, ...props }) => {
    return (
      <div {...props} className={cx(c.user, className)}>
        <div>
          <PlayerAvatar
            width={avatarSize || 45}
            height={avatarSize || 45}
            user={user}
            alt=""
            link={link}
          />
        </div>
        <Username user={user} link={link} nolink={nolink} roles={roles} />
      </div>
    );
  },
);
