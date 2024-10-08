import React from "react";

import c from "./HeroIcon.module.scss";
import cx from "classnames";

interface IHeroIconProps {
  hero: string;
  small?: boolean;
}

export const HeroIcon: React.FC<IHeroIconProps> = ({ hero, small }) => {
  const heroName = hero.replace("npc_dota_hero_", "");
  return (
    <img
      className={cx(c.hero, { [c.small]: small })}
      alt={`Icon of hero ${heroName}`}
      src={`/heroes/${heroName}.webp`}
    />
  );
};
