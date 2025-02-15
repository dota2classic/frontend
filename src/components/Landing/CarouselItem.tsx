import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import React from "react";
import c from "./Landing.module.scss";
import { formatDate } from "@/util/dates";

interface Props {
  link: NextLinkProp;
  title: string;
  image: string;
  date?: string;
  description?: string;
}
export const CarouselItem = ({
  link,
  title,
  image,
  date,
  description,
}: Props) => {
  return (
    <PageLink
      className={c.carouselItem}
      link={link}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={c.carouselItem__grad} />
      {/*<img src={image} alt="Leaderboard" />*/}
      <div className={c.carouselItem__bgTint}>
        {date && <h4>{formatDate(new Date(date))}</h4>}
        <h3>{title}</h3>
        {description && <p className={c.description}>{description}</p>}
      </div>
    </PageLink>
  );
};
