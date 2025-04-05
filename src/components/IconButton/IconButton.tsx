import React, { PropsWithChildren } from "react";
import cx from "clsx";
import c from "./IconButton.module.scss";

type IIconButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {};

export const IconButton: React.FC<PropsWithChildren<IIconButtonProps>> = ({
  className,
  ...props
}) => {
  return (
    <span {...props} className={cx(c.iconButton, className)}>
      {props.children}
    </span>
  );
};
