import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { appApi, getApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { Role } from "@/api/mapped-models";
import Image from "next/image";

const LoginProfileNavbarItem = observer(function LoginNavbarItem() {
  const { parsedToken, smallAvatar, logout } = useStore().auth;

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
      options={[
        {
          label: "Матчи",
          action: AppRouter.players.playerMatches(parsedToken.sub).link,
        },
        {
          label: "Выйти",
          action: logout,
        },
      ]}
    >
      <span>{parsedToken.name}</span>
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

export const Navbar = observer(() => {
  const { auth } = useStore();
  const isAdmin = auth.parsedToken?.roles.includes(Role.ADMIN);
  const isAuthorized = auth.isAuthorized;

  const { data: liveMatches } =
    getApi().liveApi.useLiveMatchControllerListMatches({
      refreshInterval: 5000,
    });

  const hasLiveMatches = liveMatches && liveMatches.length > 0;

  return (
    <>
      <div className={c.navbar}>
        <div className={c.navbarInner}>
          <ul className={c.navbarList}>
            <NavbarItem link={AppRouter.index.link}>DOTA2CLASSIC</NavbarItem>
            {isAuthorized && (
              <NavbarItem link={AppRouter.queue.link}>Играть</NavbarItem>
            )}

            <NavbarItem link={AppRouter.download.link}>Скачать</NavbarItem>
            <NavbarItem link={AppRouter.players.leaderboard().link}>
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
        {isAdmin && (
          <div className={c.navbarInner}>
            <ul className={c.navbarList}>
              <NavbarItem link={AppRouter.admin.servers.link}>
                Сервера
              </NavbarItem>
              <NavbarItem link={AppRouter.admin.queues.link}>
                Очереди
              </NavbarItem>
              <NavbarItem link={AppRouter.admin.crimes().link}>
                Нарушения
              </NavbarItem>
            </ul>
          </div>
        )}
      </div>
    </>
  );
});
