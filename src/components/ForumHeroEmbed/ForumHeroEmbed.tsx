import React, { PropsWithChildren } from "react";

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
  const RootComponent: React.FC = nolink
    ? (p: PropsWithChildren<{ className?: string }>) =>
        React.createElement("a", { ...p, href: "#" })
    : PageLink;

  return (
    <RootComponent
      link={AppRouter.heroes.hero.index(hero).link}
      className={cx(c.heroEmbed, "link")}
    >
      <HeroIcon small hero={hero} />
      <span>{heroName(hero)}</span>
    </RootComponent>
  );
};
