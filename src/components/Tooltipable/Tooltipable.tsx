import React, { PropsWithChildren, ReactNode, useRef } from "react";

import c from "./Tooltipable.module.scss";
import cx from "clsx";
import { useToggle } from "react-use";
import { createPortal } from "react-dom";
import { GenericTooltip } from "../GenericTooltip";

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

  const realChildren = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        className: cx(c.tooltipable, className),
        ref: ref,
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
      } as unknown as never);
    }
    return child;
  });

  return (
    <>
      {visible &&
        ref.current &&
        createPortal(
          <GenericTooltip
            anchor={ref.current!}
            onClose={() => setVisible(false)}
          >
            <div className={c.tooltip}>{tooltip}</div>
          </GenericTooltip>,
          document.body,
        )}
      {realChildren}
    </>
  );
};
