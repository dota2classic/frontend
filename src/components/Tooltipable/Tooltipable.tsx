import React, { PropsWithChildren, ReactNode } from "react";

import c from "./Tooltipable.module.scss";
import cx from "clsx";

interface ITooltipableProps {
  tooltip: ReactNode;
  className?: string;
  tooltipClassName?: string;
}

export const Tooltipable: React.FC<PropsWithChildren<ITooltipableProps>> = ({
  tooltip,
  children,
  className,
  tooltipClassName,
}) => {
  return (
    <span className={cx(c.tooltipable, className)}>
      <div className={cx(c.tooltip, tooltipClassName)}>{tooltip}</div>
      {children}
    </span>
  );
};
