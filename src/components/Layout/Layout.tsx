import React, { PropsWithChildren } from "react";

import { Navbar, Notifications, SearchGameFloater, TelegramInvite } from "..";

import c from "./Layout.module.scss";
import cx from "clsx";
import { useRouter } from "next/router";
import { ThemeContext } from "@/util/theme";

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
      </div>
    </ThemeContext.Provider>
  );
};
