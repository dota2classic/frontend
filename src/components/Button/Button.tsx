import React from "react";

import c from "./Button.module.scss";
import cx from "classnames";

export const Button: React.FC<
  { link?: boolean } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
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
