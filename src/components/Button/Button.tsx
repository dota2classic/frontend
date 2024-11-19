import React, { PropsWithChildren } from "react";

import c from "./Button.module.scss";
import cx from "clsx";

export const Button: React.FC<
  PropsWithChildren<{
    link?: boolean;
    disabled?: boolean;
    href?: string;
    className?: string;
    onClick?: () => void;
  }>
> = ({ className, link, ...props }) => {
  if (link)
    return (
      <a className={cx(c.button, className)} {...props}>
        {props.children}
      </a>
    );
  return (
    <button className={cx(c.button, className)} {...props}>
      {props.children}
    </button>
  );
};
