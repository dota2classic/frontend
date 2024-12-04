import React, { PropsWithChildren, ReactNode } from "react";

import c from "./Tooltipable.module.scss";
import cx from "clsx";

interface ITooltipableProps {
  tooltip: ReactNode;
  className?: string;
  tooltipClassName?: string;

  tooltipPosition?: "left" | "top" | "right" | "bottom";
}

export const Tooltipable: React.FC<PropsWithChildren<ITooltipableProps>> = ({
  tooltip,
  children,
  className,
  tooltipClassName,
  tooltipPosition,
}) => {
  return (
    <span className={cx(c.tooltipable, className)}>
      <div
        className={cx(c.tooltip, tooltipClassName, {
          [c.left]: tooltipPosition === "left",
          [c.right]: tooltipPosition === "right",
          [c.top]: tooltipPosition === "top",
          [c.bottom]: tooltipPosition === "bottom",
        })}
      >
        {tooltip}
      </div>
      {children}
    </span>
  );
};
