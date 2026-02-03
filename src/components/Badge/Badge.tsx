import React from "react";

import c from "./Badge.module.scss";
import cx from "clsx";
import { threadFont } from "@/const/fonts";

export type BadgeVariant = "green" | "grey" | "blue" | "yellow" | "red";

export const Badge: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > & { variant: BadgeVariant }
> = ({ children, variant, ...props }) => {
  return (
    <span
      {...props}
      className={cx(
        props.className,
        threadFont.className,
        c.badge,
        variant === "green" && c.green,
        variant === "grey" && c.grey,
        variant === "yellow" && c.yellow,
        variant === "blue" && c.blue,
        variant === "red" && c.red,
      )}
    >
      {children}
    </span>
  );
};
