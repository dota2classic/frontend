import c from "./Landing.module.scss";
import cx from "clsx";
import React, { PropsWithChildren } from "react";

export const Carousel = (p: PropsWithChildren) => {
  return <div className={cx(c.block, c.carousel)}>{p.children}</div>;
};
