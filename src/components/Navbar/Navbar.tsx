import React, { useEffect, useState } from "react";

import {LanguageSwitcher, Logo, NavbarItem} from "..";

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
import { FaCoins, FaJournalWhills } from "react-icons/fa";
import { IoMdContacts, IoMdHelp } from "react-icons/io";
import { GiFist } from "react-icons/gi";
import { AiOutlineTeam } from "react-icons/ai";
import { useTranslation } from "react-i18next";

export const Navbar = observer(function Navbar(p: { className?: string }) {
  const { t } = useTranslation();
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
        1000 * 60 * 60 * 24
      : false;

  return (
    <div className={cx(c.navbar, p.className)}>
      <div className={c.navbarInner}>
        <ul className={c.navbarList}>
          <NavbarItem
            className={cx(c.root, "onboarding-logo")}
            action={AppRouter.index.link}
          >
            <Logo />
            <span>{t("navbar.dota2classic")}</span>
          </NavbarItem>
          <div className={cx(c.navbarList__desktop, menuOpen && c.visible)}>
            {(isAuthorized && (
              <NavbarItem
                className={c.play}
                action={AppRouter.queue.link}
                options={[
                  {
                    Icon: FaPeopleGroup,
                    label: t("navbar.lobby"),
                    action: AppRouter.lobby.index.link,
                  },
                  {
                    newCategory: true,
                    label: t("navbar.howToPlay"),
                    action: AppRouter.download.link,
                  },
                  {
                    label: t("navbar.clientSettings"),
                    action: AppRouter.static.tech.commands.link,
                  },
                  {
                    label: t("navbar.fpsPing"),
                    action: AppRouter.static.tech.performance.link,
                  },
                  {
                    label: t("navbar.commonIssues"),
                    action: AppRouter.static.tech.faq.link,
                  },
                ]}
              >
                {t("navbar.play")}
              </NavbarItem>
            )) || (
              <NavbarItem className={c.play} action={AppRouter.download.link}>
                {t("navbar.howToPlay")}
              </NavbarItem>
            )}
            <NavbarItem
              action={AppRouter.blog.index.link}
              tip={newBlogRecently && "!"}
            >
              {t("navbar.news")}
            </NavbarItem>
            <MetaNavbarItem />
            <NavbarItem
              className={c.play}
              action={AppRouter.forum.index().link}
              options={[
                {
                  Icon: IoMdHelp,
                  label: t("navbar.support"),
                  action: AppRouter.forum.ticket.index().link,
                },
                {
                  Icon: GiFist,
                  label: t("navbar.complaints"),
                  action: AppRouter.forum.report.index().link,
                },
              ]}
            >
              {t("navbar.forum")}
            </NavbarItem>
            <NavbarItem
              className={c.play}
              action={AppRouter.info.link}
              options={[
                {
                  Icon: AiOutlineTeam,
                  label: t("navbar.vacancies"),
                  action: AppRouter.vacancies.link,
                },
                {
                  Icon: MdGavel,
                  label: t("navbar.rules"),
                  action: AppRouter.rules.link,
                },
                {
                  Icon: IoMdContacts,
                  label: t("navbar.documents"),
                  action: AppRouter.contact.link,
                },
                {
                  newCategory: true,
                  Icon: FaJournalWhills,
                  label: t("navbar.violationsLog"),
                  action: AppRouter.banLog.index().link,
                },
              ]}
            >
              {t("navbar.aboutProject")}
            </NavbarItem>
            <NavbarItem action={AppRouter.store.index.link}>
              <FaCoins color={"#f8d300"} />
              {t("navbar.store")}
            </NavbarItem>
            {hasLiveMatches && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.matches.live.link}
                tip={live.liveMatches.length}
              >
                {t("navbar.live")}
              </NavbarItem>
            )}
            {hasStreams && (
              <NavbarItem
                className={c.liveMatch}
                action={AppRouter.streams.link}
                tip={live.streams.length}
              >
                {t("navbar.stream")}
              </NavbarItem>
            )}
            {(isAdmin || isModerator) && <AdminNavbarItem />}
            <div className={c.spacer} />
            <LanguageSwitcher />
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
