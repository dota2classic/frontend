import React, { PropsWithChildren } from "react";

import c from "./Carousel.module.scss";
import cx from "clsx";

type DivProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export const Carousel = (p: PropsWithChildren<DivProps>) => {
  return <div className={cx(p.className, c.carousel)}>{p.children}</div>;
};
