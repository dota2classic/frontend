import React, { PropsWithChildren, ReactNode } from "react";

import c from "./TooltipIcon.module.scss";
import cx from "classnames";

interface ITooltipIconProps {
  className?: string;
  tooltip: ReactNode;
  color?: string;
}

export const TooltipIcon: React.FC<PropsWithChildren<ITooltipIconProps>> = ({
  className,
  children,
  tooltip,
}) => {
  return (
    <span className={cx(c.tooltipIcon, className)}>
      {children}
      <span className={c.tooltipText}>{tooltip}</span>
    </span>
  );
};
