import React, { PropsWithChildren } from "react";

import c from "./Layout.module.scss";
import cx from "clsx";
import { useRouter } from "next/router";
import { ThemeContext } from "@/util/theme";
import { DiscordInvite } from "../TelegramInvite";
import { TrajanPro } from "@/const/fonts";
import { useShowSideAdBlocks } from "@/util/usePageSize";
import { useTranslation } from "react-i18next";
import { AdBlockType, HorizontalAdBlock, SideAdBlock } from "../AdBlock";
import { Navbar } from "../Navbar";
import { Notifications } from "../Notifications";
import { SearchGameFloater } from "../SearchGameFloater";
import { TelegramInvite } from "../TelegramInvite";

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const { t } = useTranslation();
  const r = useRouter();
  const isQueuePage = r.pathname === "/queue";
  const isLanding = r.pathname === "/" || r.pathname === "/store";
  const isStore = r.pathname === "/store";

  const showSideAds = useShowSideAdBlocks();

  console.log("Show side ads?", showSideAds);

  return (
    <ThemeContext.Provider value={{ newYear: true }}>
      <div
        className={cx(c.wrapper, isQueuePage && c.wrapper__queue, c.blogpost)}
      >
        <Navbar className={TrajanPro.className} />
        <div
          className={cx(
            c.layout,
            isQueuePage && c.layoutQueue,
            isLanding && c.layoutLanding,
            className,
          )}
        >
          <Notifications />
          <SearchGameFloater />
          {!isLanding && <SideAdBlock bannerId={AdBlockType.BANNER_LEFT} />}
          <div
            className={cx(
              c.middleContent,
              isLanding && c.landing,
              r.pathname === "/queue" && c.queue,
            )}
          >
            {!isLanding && (
              <HorizontalAdBlock bannerId={AdBlockType.HORIZONTAL_FULLWIDTH} />
            )}
            <main
              className={cx(
                c.layoutInner,
                r.pathname === "/queue" && c.queue,
                isStore && c.store,
              )}
            >
              {children}
            </main>
            <footer className={cx(c.footer, isQueuePage && c.footer__queue)}>
              <div className={c.footer__bottom}>
                <div>{t("layout.copyright", { min: 2020, max: 2025 })}</div>
                <div>{t("layout.trademark")}</div>
                <TelegramInvite noText />
                <DiscordInvite noText />
              </div>
            </footer>
          </div>
          {!isLanding && <SideAdBlock bannerId={AdBlockType.BANNER_RIGHT} />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
