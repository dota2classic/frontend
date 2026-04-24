import React from "react";
import cx from "clsx";
import { Surface } from "../Surface";
import c from "./SurfaceHeader.module.scss";

interface SurfaceHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

export const SurfaceHeader: React.FC<SurfaceHeaderProps> = ({
  className,
  left,
  right,
  leftClassName,
  rightClassName,
  children,
  ...props
}) => {
  return (
    <Surface
      {...props}
      className={cx(c.header, className)}
      padding="xs"
      variant="panel"
    >
      {left !== undefined && (
        <div className={cx(c.left, leftClassName)}>{left}</div>
      )}
      {right !== undefined && (
        <div className={cx(c.right, rightClassName)}>{right}</div>
      )}
      {children}
    </Surface>
  );
};
