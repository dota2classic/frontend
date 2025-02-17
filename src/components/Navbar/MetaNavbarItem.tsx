import c from "@/components/Navbar/Navbar.module.scss";
import { AppRouter } from "@/route";
import { NavbarItem } from "@/components";
import React from "react";

export const MetaNavbarItem = () => {
  return (
    <NavbarItem
      testId="navbar-user"
      className={c.user}
      ignoreActive
      action={AppRouter.matches.index().link}
      options={[
        {
          label: "Герои",
          action: AppRouter.heroes.index.link,
        },
        {
          label: "Игроки",
          action: AppRouter.players.leaderboard().link,
        },
        {
          label: "Предметы",
          action: AppRouter.wiki.index.link,
        },
      ]}
    >
      История игр
    </NavbarItem>
  );
};
