import React from "react";

import c from "./HeroIcon.module.scss";
import cx from "classnames";

interface IHeroIconProps {
  hero: string;
  small?: boolean;
}

const smallImageStyles = { width: 53, height: 30 };
const bigImageStyles = { width: 71, height: 40 };

export const HeroIcon: React.FC<IHeroIconProps> = ({ hero, small }) => {
  const heroName = hero.replace("npc_dota_hero_", "");
  return (
    <img
      width={small ? smallImageStyles.width : bigImageStyles.width}
      height={small ? smallImageStyles.height : bigImageStyles.height}
      className={cx(c.hero, { [c.small]: small })}
      alt={`Icon of hero ${heroName}`}
      src={`/heroes/${heroName}.webp`}
    />
  );
};
