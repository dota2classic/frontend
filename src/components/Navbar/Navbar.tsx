import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import {FaSteam} from "react-icons/fa";

export const Navbar = () => {
  return (
    <div className={c.navbar}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem link={AppRouter.index.link}>Dota2classic</NavbarItem>
          <NavbarItem link={AppRouter.queue.link}>Играть</NavbarItem>
          <NavbarItem link={AppRouter.download.link}>Скачать</NavbarItem>
          <NavbarItem link={AppRouter.leaderboard.link}>Игроки</NavbarItem>
          <NavbarItem link={AppRouter.heroes.index.link}>Герои</NavbarItem>
          <NavbarItem link={AppRouter.history.index.link}>Матчи</NavbarItem>

          <div className={c.spacer} />
          <NavbarItem link={AppRouter.download.link}>
            <FaSteam style={{ marginRight: 4 }} />
            Войти
          </NavbarItem>
        </ul>
      </div>
    </div>
  );
};
