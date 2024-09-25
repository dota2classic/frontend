import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { appApi, useApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

const LoginProfileNavbarItem = observer(() => {
  const { parsedToken } = useStore().auth;

  if (!parsedToken)
    return (
      <NavbarItem
        ignoreActive
        href={`${appApi.apiParams.basePath}/v1/auth/steam`}
      >
        <FaSteam style={{ marginRight: 4 }} />
        Войти
      </NavbarItem>
    );

  return (
    <NavbarItem
      ignoreActive
      link={AppRouter.players.player.index(parsedToken.sub).link}
    >
      <span>{parsedToken.name}</span>
      <img
        className={c.playerAvatar}
        src={parsedToken.avatar}
        alt="User avatar"
      />
    </NavbarItem>
  );
});

export const Navbar = observer(() => {
  const { auth } = useStore();
  const isAdmin = auth.parsedToken?.roles.includes("ADMIN");

  const { data: liveMatches } =
    useApi().liveApi.useLiveMatchControllerListMatches({
      refreshInterval: 5000,
    });

  return (
    <div className={c.navbar}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem link={AppRouter.index.link}>DOTA2CLASSIC</NavbarItem>
          <NavbarItem link={AppRouter.queue.link}>Играть</NavbarItem>
          <NavbarItem link={AppRouter.download.link}>Скачать</NavbarItem>
          <NavbarItem link={AppRouter.players.leaderboard.link}>
            Игроки
          </NavbarItem>
          <NavbarItem link={AppRouter.heroes.index.link}>Герои</NavbarItem>
          <NavbarItem link={AppRouter.matches.index().link}>Матчи</NavbarItem>
          {liveMatches?.length !== 0 && (
            <NavbarItem link={AppRouter.matches.live.link}>Live</NavbarItem>
          )}
          {isAdmin && (
            <NavbarItem admin link={AppRouter.admin.servers.link}>
              Админка
            </NavbarItem>
          )}
          <div className={c.spacer} />
          <LoginProfileNavbarItem />
        </ul>
      </div>
    </div>
  );
});
