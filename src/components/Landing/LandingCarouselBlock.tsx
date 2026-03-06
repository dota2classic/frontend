import React, { ReactNode } from "react";
import cx from "clsx";
import c from "./Landing.module.scss";
import { PageLink } from "../PageLink";
import { NextLinkProp } from "@/route";

interface Props {
  title: string;
  viewAllLink?: NextLinkProp;
  viewAllLabel?: string;
  children: ReactNode;
}

export const LandingCarouselBlock: React.FC<Props> = ({
  title,
  viewAllLink,
  viewAllLabel,
  children,
}) => {
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>{title}</header>
        {viewAllLink && viewAllLabel && (
          <PageLink link={viewAllLink}>{viewAllLabel}</PageLink>
        )}
      </div>
      {children}
    </div>
  );
};
