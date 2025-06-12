import React, { PropsWithChildren } from "react";

import {
  Navbar,
  Notifications,
  SearchGameFloater,
  SideAdBlock,
  TelegramInvite,
} from "..";

import c from "./Layout.module.scss";
import cx from "clsx";
import { useRouter } from "next/router";
import { ThemeContext } from "@/util/theme";
import { AdBlockType } from "@/components/AdBlock/AdBlockType";
import { DiscordInvite } from "@/components/TelegramInvite/DiscordInvite";
import { TrajanPro } from "@/const/fonts";

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const r = useRouter();
  const isQueuePage = r.pathname === "/queue";
  const isLanding = r.pathname === "/" || r.pathname === "/store";
  const isStore = r.pathname === "/store";

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
                <div> © 2020 - 2025 dotaclassic.ru</div>
                <div>
                  Dota 2 is a registered trademark of Valve Corporation.
                </div>
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
