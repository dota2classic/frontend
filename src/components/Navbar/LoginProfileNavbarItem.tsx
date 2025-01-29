import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Image from "next/image";
import { getAuthUrl } from "@/util/getAuthUrl";

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
          label: "Матчи",
          action: AppRouter.players.playerMatches(parsedToken.sub).link,
        },
        {
          label: "Герои",
          action: AppRouter.players.player.heroes(parsedToken.sub).link,
        },
        {
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
