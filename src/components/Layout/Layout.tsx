import React, { PropsWithChildren, useState } from "react";

import { ItemTooltip, Navbar, Notifications, SearchGameFloater } from "..";

import c from "./Layout.module.scss";
import cx from "classnames";
import { TooltipContext, TooltipContextData } from "@/util/hooks";
import { useRouter } from "next/router";

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const [ctx, setCtx] = useState<TooltipContextData["ctx"]>(undefined);
  const r = useRouter();

  return (
    <TooltipContext.Provider
      value={{
        ctx,
        setCtx,
      }}
    >
      <div className={cx(c.layout, className)}>
        {ctx && <ItemTooltip hoveredElement={ctx.hovered} item={ctx.item} />}
        <Navbar />
        <Notifications />
        <SearchGameFloater />
        <main
          className={cx(c.layoutInner, r.pathname === "/asdf" && c.landing)}
        >
          {children}
        </main>
      </div>
    </TooltipContext.Provider>
  );
};
