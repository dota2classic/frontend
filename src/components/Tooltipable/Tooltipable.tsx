import React, { PropsWithChildren, ReactNode, useRef } from "react";

import c from "./Tooltipable.module.scss";
import cx from "clsx";
import { useToggle } from "react-use";
import { createPortal } from "react-dom";
import { GenericTooltip } from "@/components";

interface ITooltipableProps {
  tooltip: ReactNode;
  className?: string;
  tooltipClassName?: string;
}

export const Tooltipable: React.FC<PropsWithChildren<ITooltipableProps>> = ({
  tooltip,
  children,
  className,
}) => {
  const [visible, setVisible] = useToggle(false);
  const ref = useRef<HTMLTableHeaderCellElement | null>(null);
  return (
    <>
      {visible &&
        ref.current &&
        createPortal(
          <GenericTooltip
            anchor={ref.current!}
            onClose={() => setVisible(false)}
          >
            <span className={c.tooltip}>{tooltip}</span>
          </GenericTooltip>,
          document.body,
        )}
      <th
        className={cx(c.tooltipable, className)}
        ref={ref}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </th>
    </>
  );
};
