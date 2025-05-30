import React, { useEffect, useState } from "react";

import { Logo, NavbarItem } from "..";

import c from "./Navbar.module.scss";
import { AppRouter } from "@/route";
import { getApi } from "@/api/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { IoMenu } from "react-icons/io5";
import cx from "clsx";
import { useRouterChanging } from "@/util";
import { LoginProfileNavbarItem } from "@/components/Navbar/LoginProfileNavbarItem";
import { MetaNavbarItem } from "@/components/Navbar/MetaNavbarItem";
import { AdminNavbarItem } from "@/components/Navbar/AdminNavbarItem";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdGavel } from "react-icons/md";
import { FaCoins, FaInfo, FaJournalWhills } from "react-icons/fa";
import { IoMdContacts, IoMdHelp } from "react-icons/io";
import { GiFist } from "react-icons/gi";

export const Navbar = observer(function Navbar(p: { className?: string }) {
  const { auth, live } = useStore();
  const { isAdmin, isModerator } = auth;
  const isAuthorized = auth.isAuthorized;
  const [menuOpen, setMenuOpen] = useState(false);

  const [changing] = useRouterChanging();

  useEffect(() => {
    if (changing && menuOpen) setMenuOpen(false);
  }, [changing, menuOpen]);

  const { data: latestBlog } = getApi().blog.useBlogpostControllerBlogPage(
    0,
    1,
    {
      refreshInterval: 30000,
    },
  );

  const hasLiveMatches = live.liveMatches.length > 0;
  const hasStreams = live.streams.length > 0;

  const newBlogRecently =
    latestBlog && latestBlog.data.length > 0
      ? Date.now() - new Date(latestBlog.data[0].publishDate).getTime() <
        1000 * 60 * 60 * 2
      : false;

  return (
    <div className={cx(c.navbar, p.className)}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem
            className={cx(c.root, "onboarding-logo")}
            action={AppRouter.index.link}
          >
            {/*<SiDota2 />*/}
            <Logo />
            <span>DOTA2CLASSIC</span>
          </NavbarItem>
          <div className={cx(c.navbarList__desktop, menuOpen && c.visible)}>
            {(isAuthorized && (
              <NavbarItem
                className={c.play}
                action={AppRouter.queue.link}
                options={[
                  {
                    Icon: FaPeopleGroup,
                    label: "Лобби",
                    action: AppRouter.lobby.index.link,
                  },
                  {
                    Icon: FaInfo,
                    label: "Как играть",
                    action: AppRouter.download.link,
                  },
                ]}
              >
                Играть
              </NavbarItem>
            )) || (
              <NavbarItem className={c.play} action={AppRouter.download.link}>
                Как играть
              </NavbarItem>
            )}

            <MetaNavbarItem />
            <NavbarItem
              action={AppRouter.blog.index.link}
              tip={newBlogRecently && "!"}
            >
              Новости
            </NavbarItem>
            <NavbarItem
              className={c.play}
              action={AppRouter.forum.index().link}
              options={[
                {
                  Icon: IoMdHelp,
                  label: "Поддержка",
                  action: AppRouter.forum.ticket.index().link,
                },
                {
                  Icon: GiFist,
                  label: "Жалобы",
                  action: AppRouter.forum.report.index().link,
                },
              ]}
            >
              Форум
            </NavbarItem>
            <NavbarItem
              className={c.play}
              action={AppRouter.info.link}
              options={[
                {
                  Icon: MdGavel,
                  label: "Правила",
                  action: AppRouter.rules.link,
                },
                {
                  Icon: IoMdContacts,
                  label: "Документы",
                  action: AppRouter.contact.link,
                },
                {
                  newCategory: true,
                  Icon: FaJournalWhills,
                  label: "Журнал нарушений",
                  action: AppRouter.banLog.index().link,
                },
              ]}
            >
              О проекте
            </NavbarItem>
            <NavbarItem action={AppRouter.store.index.link}>
              <FaCoins color={"#f8d300"} />
              Магазин
            </NavbarItem>

            {/*<NavbarItem action={AppRouter.rules.link}>Правила</NavbarItem>*/}
            {hasLiveMatches && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.matches.live.link}
                tip={live.liveMatches.length}
              >
                Live
              </NavbarItem>
            )}
            {hasStreams && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.streams.link}
                tip={live.streams.length}
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
