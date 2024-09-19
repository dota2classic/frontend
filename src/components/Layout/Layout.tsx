import React, { PropsWithChildren, useState } from "react";

import { ItemTooltip, Navbar, Notifications, SearchGameFloater } from "..";

import c from "./Layout.module.scss";
import cx from "classnames";
import { TooltipContext, TooltipContextData } from "@/util/hooks";

interface LayoutProps {
  className?: string;
}
export const Layout = ({
  children,
  className,
}: PropsWithChildren<LayoutProps>) => {
  const [ctx, setCtx] = useState<TooltipContextData["ctx"]>(undefined);

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
        <main className={cx(c.layoutInner)}>{children}</main>
      </div>
    </TooltipContext.Provider>
  );
};
