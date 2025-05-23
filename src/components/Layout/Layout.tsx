import React, { PropsWithChildren } from "react";

import {
  AdBlock,
  Navbar,
  Notifications,
  SearchGameFloater,
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

  return (
    <ThemeContext.Provider value={{ newYear: true }}>
      <div
        className={cx(c.wrapper, isQueuePage && c.wrapper__queue, c.blogpost)}
      >
        <Navbar className={TrajanPro.className} />
        <div className={cx(c.layout, isQueuePage && c.layoutQueue, className)}>
          <Notifications />
          <SearchGameFloater />
          {!isLanding && <AdBlock bannerId={AdBlockType.BANNER_LEFT} />}
          <div
            className={cx(
              c.middleContent,
              isLanding && c.landing,
              r.pathname === "/queue" && c.queue,
            )}
          >
            <main
              className={cx(c.layoutInner, r.pathname === "/queue" && c.queue)}
            >
              {children}
            </main>
            <footer className={c.footer}>
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
          {!isLanding && <AdBlock bannerId={AdBlockType.BANNER_RIGHT} />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
