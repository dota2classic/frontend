import React from "react";

import { PageLink } from "..";

import c from "./UserPreview.module.scss";
import { UserDTO } from "@/api/back";
import { AppRouter } from "@/route";

interface IUserPreviewProps {
  user: UserDTO;
}

export const UserPreview: React.FC<IUserPreviewProps> = ({ user }) => {
  return (
    <div className={c.user}>
      <img src={user.avatar} alt="" />
      <PageLink link={AppRouter.players.player.index(user.steamId).link}>
        {user.name}
      </PageLink>
    </div>
  );
};
