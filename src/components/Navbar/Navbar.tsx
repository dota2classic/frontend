import React, { useEffect, useState } from "react";

import { NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { getApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { IoMenu } from "react-icons/io5";
import cx from "clsx";
import { SiDota2 } from "react-icons/si";
import { useRouterChanging } from "@/util";
import { LoginProfileNavbarItem } from "@/components/Navbar/LoginProfileNavbarItem";
import { MetaNavbarItem } from "@/components/Navbar/MetaNavbarItem";
import { MdForum } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";
import { AdminNavbarItem } from "@/components/Navbar/AdminNavbarItem";

export const Navbar = observer(function Navbar(p: { className?: string }) {
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
          <NavbarItem
            className={cx(c.root, "onboarding-logo")}
            action={AppRouter.index.link}
          >
            <SiDota2 />
            DOTA2CLASSIC
          </NavbarItem>
          <div className={cx(c.navbarList__desktop, menuOpen && c.visible)}>
            {(isAuthorized && (
              <NavbarItem
                action={AppRouter.queue.link}
                options={[
                  {
                    Icon: IoMdPlay,
                    label: "Гайд",
                    action: AppRouter.download.link,
                  },
                ]}
              >
                Играть
              </NavbarItem>
            )) || (
              <NavbarItem action={AppRouter.download.link}>Гайд</NavbarItem>
            )}

            <MetaNavbarItem />
            <NavbarItem
              options={[
                {
                  Icon: MdForum,
                  action: AppRouter.forum.index().link,
                  label: "Форум",
                },
              ]}
              action={AppRouter.blog.index.link}
            >
              Новости
            </NavbarItem>
            {hasLiveMatches && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.matches.live.link}
                tip={liveMatches?.length}
              >
                Live
              </NavbarItem>
            )}
            {(isAdmin || isModerator) && <AdminNavbarItem />}
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
    </div>
  );
});
