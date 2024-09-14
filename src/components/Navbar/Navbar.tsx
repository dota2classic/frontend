import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

const LoginProfileNavbarItem = observer(() => {
  const { parsedToken } = useStore().auth;

  if (!parsedToken)
    return (
      <NavbarItem href={`${appApi.apiParams.basePath}/v1/auth/steam`}>
        <FaSteam style={{ marginRight: 4 }} />
        Войти
      </NavbarItem>
    );

  return (
    <NavbarItem link={AppRouter.players.player.index(parsedToken.sub).link}>
      {parsedToken.name}
      <img
        className={c.playerAvatar}
        src={parsedToken.avatar}
        alt="User avatar"
      />
    </NavbarItem>
  );
});

export const Navbar = () => {
  return (
    <div className={c.navbar}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem link={AppRouter.index.link}>Dota2classic</NavbarItem>
          <NavbarItem link={AppRouter.queue.link}>Играть</NavbarItem>
          <NavbarItem link={AppRouter.download.link}>Скачать</NavbarItem>
          <NavbarItem link={AppRouter.players.leaderboard.link}>
            Игроки
          </NavbarItem>
          <NavbarItem link={AppRouter.heroes.index.link}>Герои</NavbarItem>
          <NavbarItem link={AppRouter.matches.index().link}>Матчи</NavbarItem>

          <div className={c.spacer} />
          <LoginProfileNavbarItem />
        </ul>
      </div>
    </div>
  );
};
