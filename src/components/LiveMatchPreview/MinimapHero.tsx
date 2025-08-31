import { PlayerInfo } from "@/api/back";
import { remapNumber } from "@/util/math";
import cx from "clsx";
import c from "@/components/LiveMatchPreview/LiveMatchPreview.module.scss";
import { shortName } from "@/util/heroName";
import React from "react";

interface MinimapHeroProps {
  hero: PlayerInfo;
  team: number;
}

export const MinimapHero = ({ hero, team }: MinimapHeroProps) => {
  const { posX, posY, respawnTime } = hero;
  const dead = respawnTime > 0;

  const remappedX = remapNumber(posX, 0, 1, 0.02, 0.96) * 100;
  const remappedY = remapNumber(posY, 0, 1, 0.02, 0.96) * 100;

  return (
    <div
      className={cx(c.hero, shortName(hero.hero), "d2mh", {
        [c.radiant]: team === 2,
        [c.dire]: team === 3,
        [c.dead]: dead,
      })}
      style={{
        left: `${remappedX}%`,
        bottom: `${remappedY}%`,
      }}
    ></div>
  );
};
