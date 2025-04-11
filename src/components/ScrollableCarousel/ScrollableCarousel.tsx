import React from "react";

import c from "./ScrollableCarousel.module.scss";
import cx from "clsx";

type IScrollableCarouselProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { gridGap?: number };

export const ScrollableCarousel: React.FC<IScrollableCarouselProps> = ({
  children,
  className,
  gridGap,
  ...props
}) => {
  return (
    <div className={cx(c.scrollableCarousel, className)} {...props}>
      {children}
    </div>
  );
};
