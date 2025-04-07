import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam, FaUserFriends } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Image from "next/image";
import { getAuthUrl } from "@/util/getAuthUrl";
import { IoMdExit, IoMdTrophy } from "react-icons/io";
import { GiFeatheredWing } from "react-icons/gi";
import { MdViewList } from "react-icons/md";

export const LoginProfileNavbarItem = observer(function LoginNavbarItem() {
  const { parsedToken, smallAvatar, logout } = useStore().auth;

  if (!parsedToken)
    return (
      <NavbarItem ignoreActive action={getAuthUrl()} testId="navbar-login">
        <FaSteam style={{ marginRight: 4, marginTop: "-3px" }} />
        Войти
      </NavbarItem>
    );

  return (
    <NavbarItem
      testId="navbar-user"
      className={c.user}
      ignoreActive
      action={AppRouter.players.player.index(parsedToken.sub).link}
      options={[
        {
          Icon: MdViewList,
          label: "Матчи",
          action: AppRouter.players.playerMatches(parsedToken.sub).link,
        },
        {
          Icon: GiFeatheredWing,
          label: "Герои",
          action: AppRouter.players.player.heroes(parsedToken.sub).link,
        },
        {
          Icon: FaUserFriends,
          label: "Союзники",
          action: AppRouter.players.player.teammates(parsedToken.sub).link,
        },
        {
          Icon: IoMdTrophy,
          label: "Рекорды",
          action: AppRouter.players.player.records(parsedToken.sub).link,
        },
        {
          newCategory: true,
          Icon: IoMdExit,
          label: "Выйти",
          action: logout,
        },
      ]}
    >
      <span className={c.omitInTablet}>{parsedToken.name}</span>
      <Image
        width={30}
        height={30}
        className={c.playerAvatar}
        src={smallAvatar || "/avatar.png"}
        alt="User avatar"
      />
    </NavbarItem>
  );
});
