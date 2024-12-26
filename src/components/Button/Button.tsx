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
    mega?: boolean;
    target?: string;
  }>
> = ({ className, link, mega, ...props }) => {
  if (link)
    return (
      <a className={cx(c.button, mega && c.megaButton, className)} {...props}>
        {props.children}
      </a>
    );
  return (
    <button
      className={cx(c.button, mega && c.megaButton, className)}
      {...props}
    >
      {mega && (
        <>
          <span className={cx(c.snow)} />
          <span className={cx(c.snow)} />
          <span className={cx(c.snow)} />
          <span className={cx(c.snow)} />
          <span className={cx(c.snow)} />
          <span className={cx(c.snow)} />
        </>
      )}
      {props.children}
    </button>
  );
};
