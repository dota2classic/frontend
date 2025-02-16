import React, { createElement, PropsWithChildren, ReactNode } from "react";
import Image from "next/image";
import { PageLink } from "..";

import c from "./CarouselItem.module.scss";
import { NextLinkProp } from "@/route";
import { formatDate } from "@/util/dates";

interface ICarouselItemProps {
  link?: NextLinkProp;
  title: ReactNode;
  image: string;
  date?: string;
  description?: ReactNode;
}

export const CarouselItem: React.FC<ICarouselItemProps> = ({
  link,
  title,
  image,
  date,
  description,
}) => {
  const RenderContainer = link
    ? (p: PropsWithChildren<{ className?: string }>) => (
        <PageLink className={p.className} link={link!}>
          {p.children}
        </PageLink>
      )
    : (p: PropsWithChildren<{ className?: string }>) =>
        createElement("a", { ...p, href: "#" });
  return (
    <RenderContainer className={c.card}>
      <Image
        className={c.image}
        alt={""}
        src={image}
        width={500}
        height={500}
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
