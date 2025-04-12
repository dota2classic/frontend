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

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const r = useRouter();
  const isQueuePage = r.pathname === "/queue";

  return (
    <ThemeContext.Provider value={{ newYear: true }}>
      <div
        className={cx(c.wrapper, isQueuePage && c.wrapper__queue, c.blogpost)}
      >
        <Navbar className={className} />
        <div className={cx(c.layout, isQueuePage && c.layoutQueue, className)}>
          <Notifications />
          <SearchGameFloater />
          <AdBlock bannerId={AdBlockType.BANNER_LEFT} />
          <div className={c.middleContent}>
            <main
              className={cx(
                c.layoutInner,
                r.pathname === "/" && c.landing,
                r.pathname === "/queue" && c.queue,
              )}
            >
              {children}
            </main>
            <footer className={c.footer}>
              <div> © 2020 - 2025 dotaclassic.ru</div>
              <div>Dota 2 is a registered trademark of Valve Corporation.</div>
              <TelegramInvite />
            </footer>
          </div>
          <AdBlock bannerId={AdBlockType.BANNER_RIGHT} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
