import React, { PropsWithChildren } from "react";

import c from "./Layout.module.scss";
import cx from "clsx";
import { useRouter } from "next/router";
import { ThemeContext } from "@/util/theme";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";
import { Navbar } from "../Navbar";
import { Notifications } from "../Notifications";
import { SearchGameFloater } from "../SearchGameFloater";
import { AdBlockType, SideAdBlock } from "@/components/AdBlock";
import { useLazyBackground } from "@/util/useLazyBackground";
import { FloaterAd } from "@/components/FloaterAd";
import { Logo } from "@/components/Logo";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { FaDiscord, FaTelegram } from "react-icons/fa";

export interface LayoutConfig {
  fullBleed?: boolean;
  noNavbar?: boolean;
  noFooter?: boolean;
}

interface LayoutProps {
  className?: string;
  config?: LayoutConfig;
}

export const Layout = ({
  children,
  className,
  config = {},
}: PropsWithChildren<LayoutProps>) => {
  const { t } = useTranslation();
  const r = useRouter();
  const isQueuePage = r.pathname.startsWith("/queue");
  const isLanding =
    r.pathname === "/" || r.pathname === "/store" || isQueuePage;
  const isStore = r.pathname === "/store";
  const useLandingChrome = isLanding || !!config.fullBleed;

  const [ref, loaded] = useLazyBackground("/bg_repeater_lossless.webp");

  return (
    <ThemeContext.Provider value={{ newYear: true }}>
      <div
        ref={ref}
        className={cx(
          c.wrapper,
          isQueuePage && c.wrapper__queue,
          loaded && c.blogpost,
        )}
      >
        {!config.noNavbar && (
          <Navbar
            className={TrajanPro.className}
            overlay={!!config.fullBleed}
          />
        )}
        <div
          className={cx(
            c.layout,
            isQueuePage && c.layoutQueue,
            useLandingChrome && c.layoutLanding,
            className,
          )}
        >
          <Notifications />
          {!config.noNavbar && <SearchGameFloater />}
          {!useLandingChrome && (
            <SideAdBlock bannerId={AdBlockType.BANNER_LEFT} />
          )}
          <div
            className={cx(
              c.middleContent,
              useLandingChrome && c.landing,
              config.fullBleed && c.middleContentFullBleed,
              r.pathname.startsWith("/queue") && c.queue,
            )}
          >
            {!isQueuePage && !useLandingChrome && <FloaterAd />}
            <main
              className={cx(
                c.layoutInner,
                config.fullBleed && c.layoutInnerFullBleed,
                r.pathname.startsWith("/queue") && c.queue,
                isStore && c.store,
              )}
            >
              {children}
            </main>
          </div>
          {!useLandingChrome && (
            <SideAdBlock bannerId={AdBlockType.BANNER_RIGHT} />
          )}
        </div>
        {!config.noFooter && (
          <footer className={cx(c.footer, isQueuePage && c.footer__queue)}>
            <div className={c.footer__inner}>
              <PageLink
                link={AppRouter.index.link}
                className={c.footer__brand}
              >
                <Logo size={28} />
                <span className={cx(TrajanPro.className, c.footer__brandName)}>
                  DOTA2
                  <span className={c.footer__brandAccent}>CLASSIC</span>
                </span>
              </PageLink>

              <nav className={c.footer__links}>
                <PageLink className={c.footer__link} link={AppRouter.rules.link}>
                  {t("navbar.rules")}
                </PageLink>
                <PageLink className={c.footer__link} link={AppRouter.info.link}>
                  {t("navbar.aboutProject")}
                </PageLink>
                <PageLink
                  className={c.footer__link}
                  link={AppRouter.forum.index().link}
                >
                  {t("navbar.forum")}
                </PageLink>
                <PageLink className={c.footer__link} link={AppRouter.blog.index.link}>
                  {t("navbar.news")}
                </PageLink>
                <PageLink className={c.footer__link} link={AppRouter.store.index.link}>
                  {t("navbar.store")}
                </PageLink>
              </nav>

              <div className={c.footer__social}>
                <a
                  href="https://t.me/dota2classicru"
                  target="_blank"
                  rel="noreferrer"
                  className={c.footer__socialLink}
                >
                  <FaTelegram />
                  Telegram
                </a>
                <a
                  href="https://discord.gg/36D4WdNquT"
                  target="_blank"
                  rel="noreferrer"
                  className={c.footer__socialLink}
                >
                  <FaDiscord />
                  Discord
                </a>
              </div>

              <div className={c.footer__copy}>
                {t("layout.copyright", {
                  min: 2020,
                  max: new Date().getFullYear(),
                })}
                {" · "}
                {t("layout.trademark")}
              </div>
            </div>
          </footer>
        )}
      </div>
    </ThemeContext.Provider>
  );
};
