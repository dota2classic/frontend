import React, { PropsWithChildren } from "react";

import c from "./Layout.module.scss";
import cx from "clsx";
import { useRouter } from "next/router";
import { ThemeContext } from "@/util/theme";
import { DiscordInvite, TelegramInvite } from "../TelegramInvite";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";
import { Navbar } from "../Navbar";
import { Notifications } from "../Notifications";
import { SearchGameFloater } from "../SearchGameFloater";
import { AdBlockType, SideAdBlock } from "@/components/AdBlock";
import { useLazyBackground } from "@/util/useLazyBackground";
import { FloaterAd } from "@/components/FloaterAd";

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
        {!config.noNavbar && <Navbar className={TrajanPro.className} />}
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
            {!config.noFooter && (
              <footer className={cx(c.footer, isQueuePage && c.footer__queue)}>
                <div className={c.footer__bottom}>
                  <div>
                    {t("layout.copyright", {
                      min: 2020,
                      max: new Date().getFullYear(),
                    })}
                  </div>
                  <div>{t("layout.trademark")}</div>
                  <TelegramInvite noText />
                  <DiscordInvite noText />
                </div>
              </footer>
            )}
          </div>
          {!useLandingChrome && (
            <SideAdBlock bannerId={AdBlockType.BANNER_RIGHT} />
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
