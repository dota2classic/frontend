import c from "@/components/Navbar/Navbar.module.scss";
import { AppRouter } from "@/route";
import { NavbarItem } from "@/components";
import React from "react";
import { MdLeaderboard, MdViewList } from "react-icons/md";
import { GiBattleAxe, GiFeatheredWing } from "react-icons/gi";
import { IoMdTrophy } from "react-icons/io";
import { MatchmakingMode } from "@/api/mapped-models";

export const MetaNavbarItem = () => {
  return (
    <NavbarItem
      testId="navbar-user"
      className={c.user}
      ignoreActive
      action={AppRouter.meta.index.link}
      options={[
        {
          Icon: MdViewList,
          label: "Матчи",
          action: AppRouter.matches.index(0, MatchmakingMode.UNRANKED).link,
        },
        {
          Icon: GiFeatheredWing,
          label: "Герои",
          action: AppRouter.heroes.index.link,
        },
        {
          Icon: GiBattleAxe,
          label: "Предметы",
          action: AppRouter.wiki.index.link,
        },
        {
          newCategory: true,
          Icon: MdLeaderboard,
          label: "Игроки",
          action: AppRouter.players.leaderboard().link,
        },
        {
          Icon: IoMdTrophy,
          label: "Рекорды",
          action: AppRouter.records.index.link,
        },
      ]}
    >
      Статистика
    </NavbarItem>
  );
};
