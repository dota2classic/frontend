import React from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { FaSteam, FaUserFriends } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Image from "next/image";
import { getAuthUrl } from "@/util/getAuthUrl";
import { IoMdExit, IoMdTrophy } from "react-icons/io";
import { GiFeatheredWing } from "react-icons/gi";
import { MdViewList } from "react-icons/md";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { prepareAuth } from "@/util/prepareAuth";

export const LoginProfileNavbarItem = observer(function LoginNavbarItem() {
  const { parsedToken, smallAvatar, logout } = useStore().auth;
  const { t } = useTranslation();

  if (!parsedToken)
    return (
      <NavbarItem
        ignoreActive
        action={() => {
          prepareAuth();
          window.location.href = getAuthUrl();
        }}
        testId="navbar-login"
      >
        <FaSteam style={{ marginRight: 4, marginTop: "-3px" }} />
        {t("navbar.login")}
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
          Icon: MdViewList,
          label: t("navbar.matches"),
          action: AppRouter.players.playerMatches(parsedToken.sub).link,
        },
        {
          Icon: GiFeatheredWing,
          label: t("navbar.heroes"),
          action: AppRouter.players.player.heroes(parsedToken.sub).link,
        },
        {
          Icon: FaUserFriends,
          label: t("navbar.teammates"),
          action: AppRouter.players.player.teammates(parsedToken.sub).link,
        },
        {
          Icon: IoMdTrophy,
          label: t("navbar.records"),
          action: AppRouter.players.player.records(parsedToken.sub).link,
        },
        {
          newCategory: true,
          Icon: IoMdExit,
          label: t("navbar.logout"),
          action: logout,
        },
      ]}
    >
      <span className={cx(c.omitInTablet, c.playerName)}>
        {parsedToken.name}
      </span>
      <Image
        width={30}
        height={30}
        className={c.playerAvatar}
        src={smallAvatar || "/avatar.png"}
        alt={t("navbar.userAvatarAlt")}
      />
    </NavbarItem>
  );
});
