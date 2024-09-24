import React from "react";

import { HeroIcon, Panel } from "..";

import c from "./HeroStatsHeader.module.scss";
import heroName from "@/util/heroName";
import { formatWinrate } from "@/util/math";

interface IHeroStatsHeaderProps {
  hero: string;
  popularity: number;
  games: number;
  wins: number;
}

export const HeroStatsHeader: React.FC<IHeroStatsHeaderProps> = ({
  hero,
  popularity,
  wins,
  games,
}) => {
  const isWinrateNonNegative = wins / Math.max(1, games) >= 0.5;
  return (
    <Panel className={c.heroSummary}>
      <div className={"left"}>
        <HeroIcon hero={hero} />
        <span className={c.heroName}>{heroName(hero)}</span>
      </div>
      <div className="right">
        <dl>
          <dd>{popularity}</dd>
          <dt>Популярность</dt>
        </dl>

        <dl>
          <dd className="green">{games}</dd>
          <dt>Матчи</dt>
        </dl>
        <dl>
          <dd className="green">{wins}</dd>
          <dt>Победы</dt>
        </dl>

        <dl>
          <dd className={isWinrateNonNegative ? "green" : "red"}>
            {formatWinrate(wins, games - wins)}
          </dd>
          <dt>Доля побед</dt>
        </dl>
      </div>
    </Panel>
  );
};
