import React, { createElement, PropsWithChildren, ReactNode } from "react";
import Image from "next/image";
import { PageLink } from "..";

import c from "./CarouselItem.module.scss";
import { NextLinkProp } from "@/route";
import { formatDate } from "@/util/dates";
import cx from "clsx";

interface ICarouselItemProps {
  link?: NextLinkProp | string;
  title: ReactNode;
  image: string;
  date?: string;
  description?: ReactNode;
  alwaysShowDescription?: boolean;
  badge?: number;
  unoptimized?: boolean;
}

export const CarouselItem: React.FC<ICarouselItemProps> = ({
  link,
  title,
  image,
  date,
  description,
  badge,
  alwaysShowDescription,
  unoptimized,
}) => {
  const RenderContainer = link
    ? typeof link === "string"
      ? (p: PropsWithChildren<{ className?: string }>) =>
          createElement("a", { ...p, href: link })
      : (p: PropsWithChildren<{ className?: string }>) => (
          <PageLink className={p.className} link={link as NextLinkProp}>
            {p.children}
          </PageLink>
        )
    : (p: PropsWithChildren<{ className?: string }>) =>
        createElement("a", { ...p, href: "#" });
  return (
    <RenderContainer
      className={cx(c.card, alwaysShowDescription && c.card__hovered)}
    >
      {badge && <span className={c.viewers}>{badge}</span>}
      <Image
        className={c.image}
        alt={""}
        src={image}
        width={500}
        height={500}
        unoptimized={unoptimized}
      />
      <div className={c.shadow} />
      <div className={c.contentContainer}>
        {date && <h4>{formatDate(new Date(date))}</h4>}
        <h3>{title}</h3>
        {description && <p className={c.description}>{description}</p>}
      </div>
    </RenderContainer>
  );
};
