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
import {
  AdBlockType,
  HorizontalAdBlock,
  SideAdBlock,
} from "@/components/AdBlock";
import { useLazyBackground } from "@/util/useLazyBackground";

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const { t } = useTranslation();
  const r = useRouter();
  const isQueuePage = r.pathname.startsWith("/queue");
  const isAdmin = r.pathname.startsWith("/admin");
  const isLanding =
    r.pathname === "/" || r.pathname === "/store" || isQueuePage;
  const isStore = r.pathname === "/store";

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
              r.pathname.startsWith("/queue") && c.queue,
            )}
          >
            {!isLanding && !isAdmin && (
              <HorizontalAdBlock bannerId={AdBlockType.HORIZONTAL_FULLWIDTH} />
            )}
            <main
              className={cx(
                c.layoutInner,
                r.pathname.startsWith("/queue") && c.queue,
                isStore && c.store,
              )}
            >
              {children}
            </main>
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
          </div>
          {!isLanding && <SideAdBlock bannerId={AdBlockType.BANNER_RIGHT} />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
