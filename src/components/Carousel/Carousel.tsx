import React, { PropsWithChildren } from "react";

import c from "./Carousel.module.scss";
import cx from "clsx";

type DivProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { gridCnt?: number };
export const Carousel = (p: PropsWithChildren<DivProps>) => {
  return (
    <div
      className={cx(p.className, c.carousel)}
      style={{ gridTemplateColumns: `repeat(${p.gridCnt}, 1fr)` }}
    >
      {p.children}
    </div>
  );
};
