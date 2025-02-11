import React from "react";

import { HeroIcon } from "..";

import c from "./ForumHeroEmbed.module.scss";
import heroName from "@/util/heroName";

interface IForumHeroEmbedProps {
  hero: string;
}

export const ForumHeroEmbed: React.FC<IForumHeroEmbedProps> = ({ hero }) => {
  return (
    <div className={c.heroEmbed}>
      <HeroIcon small hero={hero} />
      <span>{heroName(hero)}</span>
    </div>
  );
};
