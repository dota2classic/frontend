import React, { useEffect, useState } from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam } from "react-icons/fa";
import { appApi, getApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import cx from "clsx";
import { SiDota2 } from "react-icons/si";
import { useRouterChanging } from "@/util/hooks";

const LoginProfileNavbarItem = observer(function LoginNavbarItem() {
  const { parsedToken, smallAvatar, logout } = useStore().auth;

  if (!parsedToken)
    return (
      <NavbarItem
        ignoreActive
        action={`${appApi.apiParams.basePath}/v1/auth/steam`}
      >
        <FaSteam style={{ marginRight: 4, marginTop: "-3px" }} />
        Войти
      </NavbarItem>
    );

  return (
    <NavbarItem
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

export const Navbar = observer((p: { className?: string }) => {
  const { auth } = useStore();
  const { isAdmin, isModerator } = auth;
  const isAuthorized = auth.isAuthorized;
  const [menuOpen, setMenuOpen] = useState(false);

  const [changing] = useRouterChanging();

  useEffect(() => {
    if (changing && menuOpen) setMenuOpen(false);
  }, [changing, menuOpen]);

  const { data: liveMatches } =
    getApi().liveApi.useLiveMatchControllerListMatches({
      refreshInterval: 5000,
    });

  const hasLiveMatches = liveMatches && liveMatches.length > 0;

  return (
    <div className={cx(c.navbar, p.className)}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem className={c.root} action={AppRouter.index.link}>
            <SiDota2 />
            DOTA2CLASSIC
          </NavbarItem>
          <div className={cx(c.navbarList__desktop, menuOpen && c.visible)}>
            {isAuthorized && (
              <NavbarItem action={AppRouter.queue.link}>Поиск</NavbarItem>
            )}
            <NavbarItem action={AppRouter.download.link}>Играть</NavbarItem>
            <NavbarItem action={AppRouter.players.leaderboard().link}>
              Игроки
            </NavbarItem>
            <NavbarItem action={AppRouter.heroes.index.link}>Герои</NavbarItem>
            <NavbarItem action={AppRouter.matches.index().link}>
              Матчи
            </NavbarItem>
            <NavbarItem action={AppRouter.forum.index().link}>Форум</NavbarItem>
            {hasLiveMatches && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.matches.live.link}
                tip={liveMatches?.length}
              >
                Live
              </NavbarItem>
            )}
            <div className={c.spacer} />
            <LoginProfileNavbarItem />
          </div>

          <div className={c.mobileMenu}>
            <NavbarItem action={() => setMenuOpen((t) => !t)}>
              <IoMenu />
            </NavbarItem>
          </div>
        </ul>
      </div>
      {(isAdmin || isModerator) && (
        <div className={cx(c.navbarInner, c.navbar__admin)}>
          <ul className={c.navbarList}>
            <NavbarItem action={AppRouter.admin.servers.link}>
              Сервера
            </NavbarItem>
            <NavbarItem action={AppRouter.admin.queues.link}>
              Очереди
            </NavbarItem>
            <NavbarItem action={AppRouter.admin.crimes().link}>
              Нарушения
            </NavbarItem>
          </ul>
        </div>
      )}
    </div>
  );
});
