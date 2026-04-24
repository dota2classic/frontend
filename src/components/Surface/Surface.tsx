import React from "react";
import cx from "clsx";
import c from "./Surface.module.scss";

export type SurfaceVariant = "canvas" | "surface" | "raised" | "panel";
export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg";

type SurfaceProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  interactive?: boolean;
};

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      className,
      variant = "surface",
      padding = "md",
      interactive = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          c.surface,
          c[`variant__${variant}`],
          c[`padding__${padding}`],
          interactive && c.interactive,
          className,
        )}
      >
        {props.children}
      </div>
    );
  },
);

Surface.displayName = "Surface";
