import React from "react";
import cx from "clsx";
import c from "./MetaGrid.module.scss";

interface MetaGridProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  gap?: number | string;
}

interface MetaGridStatProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  label: React.ReactNode;
  value: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
}

export const MetaGrid: React.FC<MetaGridProps> = ({
  className,
  style,
  gap,
  children,
  ...props
}) => {
  const resolvedStyle =
    gap !== undefined
      ? {
          ...style,
          ["--meta-grid-gap" as string]:
            typeof gap === "number" ? `${gap}px` : gap,
        }
      : style;

  return (
    <div {...props} className={cx(c.grid, className)} style={resolvedStyle}>
      {children}
    </div>
  );
};

export const MetaGridStat: React.FC<MetaGridStatProps> = ({
  className,
  label,
  value,
  labelClassName,
  valueClassName,
  ...props
}) => {
  return (
    <div {...props} className={cx(c.stat, className)}>
      <span className={cx(c.label, labelClassName)}>{label}</span>
      <span className={cx(c.value, valueClassName)}>{value}</span>
    </div>
  );
};
