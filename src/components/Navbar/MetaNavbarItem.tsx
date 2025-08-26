import { AppRouter } from "@/route";
import { NavbarItem } from "@/components";
import React from "react";
import { MdLeaderboard, MdViewList } from "react-icons/md";
import { GiBattleAxe, GiFeatheredWing } from "react-icons/gi";
import { IoMdTrophy } from "react-icons/io";
import { MatchmakingMode } from "@/api/mapped-models";
import { useTranslation } from "react-i18next";

export const MetaNavbarItem = () => {
  const { t } = useTranslation();

  return (
    <NavbarItem
      testId="navbar-user"
      // className={c.user}
      ignoreActive
      action={AppRouter.meta.index.link}
      options={[
        {
          Icon: MdViewList,
          label: t("meta_navbar.matches"),
          action: AppRouter.matches.index(0, MatchmakingMode.UNRANKED).link,
        },
        {
          Icon: GiFeatheredWing,
          label: t("meta_navbar.heroes"),
          action: AppRouter.heroes.index.link,
        },
        {
          Icon: GiBattleAxe,
          label: t("meta_navbar.items"),
          action: AppRouter.wiki.index.link,
        },
        {
          newCategory: true,
          Icon: MdLeaderboard,
          label: t("meta_navbar.players"),
          action: AppRouter.players.leaderboard().link,
        },
        {
          Icon: IoMdTrophy,
          label: t("meta_navbar.records"),
          action: AppRouter.records.index.link,
        },
      ]}
    >
      {t("meta_navbar.meta")}
    </NavbarItem>
  );
};
