import React from "react";
import cx from "clsx";
import c from "./PageGrid.module.scss";

interface PageGridProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  gap?: number | string;
}

interface PageGridItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  span?: 4 | 6 | 8 | 12;
}

export const PageGrid: React.FC<PageGridProps> = ({
  className,
  style,
  gap,
  ...props
}) => {
  const resolvedStyle =
    gap !== undefined
      ? {
          ...style,
          ["--page-grid-gap" as string]:
            typeof gap === "number" ? `${gap}px` : gap,
        }
      : style;

  return (
    <div {...props} className={cx(c.grid, className)} style={resolvedStyle}>
      {props.children}
    </div>
  );
};

export const PageGridItem: React.FC<PageGridItemProps> = ({
  className,
  span = 12,
  ...props
}) => {
  return (
    <div {...props} className={cx(c[`span${span}`], className)}>
      {props.children}
    </div>
  );
};
