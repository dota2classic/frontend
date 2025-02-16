import React from "react";

import { HeroIcon, PageLink } from "..";

import c from "./ForumHeroEmbed.module.scss";
import heroName from "@/util/heroName";
import { AppRouter } from "@/route";
import cx from "clsx";

interface IForumHeroEmbedProps {
  hero: string;
  nolink?: boolean;
}

export const ForumHeroEmbed: React.FC<IForumHeroEmbedProps> = ({
  hero,
  nolink,
}) => {
  const content = (
    <>
      <HeroIcon small hero={hero} />
      <span>{heroName(hero)}</span>
    </>
  );

  return nolink ? (
    <a href="#" className={cx(c.heroEmbed)}>
      {content}
    </a>
  ) : (
    <PageLink
      className={cx(c.heroEmbed, "link")}
      link={AppRouter.heroes.hero.index(hero).link}
    >
      {content}
    </PageLink>
  );
};
