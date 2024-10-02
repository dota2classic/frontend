import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { appApi, useApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import cx from "classnames";
import { Role } from "@/api/mapped-models";

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
  const isAdmin = auth.parsedToken?.roles.includes(Role.ADMIN);

  const isAdminPath = useRouter().pathname.startsWith("/admin/");

  const { data: liveMatches } =
    useApi().liveApi.useLiveMatchControllerListMatches({
      refreshInterval: 5000,
    });

  const hasLiveMatches = liveMatches && liveMatches.length > 0;

  return (
    <>
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
            <NavbarItem link={AppRouter.forum.index().link}>Форум</NavbarItem>
            {hasLiveMatches && (
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
      {isAdminPath && (
        <div className={cx(c.navbar, c.navbar__admin)}>
          <div className={c.navbarInner}>
            <ul className={c.navbarList}>
              <NavbarItem link={AppRouter.admin.servers.link}>
                Сервера
              </NavbarItem>
              <NavbarItem link={AppRouter.admin.queues.link}>
                Очереди
              </NavbarItem>
            </ul>
          </div>
        </div>
      )}
    </>
  );
});
