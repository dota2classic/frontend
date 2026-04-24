import React from "react";

import c from "./HeroStatsHeader.module.scss";
import heroName from "@/util/heroName";
import { formatWinrate } from "@/util/math";
import { useTranslation } from "react-i18next";
import { HeroIcon } from "../HeroIcon";
import { StatRow } from "../StatRow";
import { SurfaceHeader } from "../SurfaceHeader";

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
  const { t } = useTranslation();
  const isWinrateNonNegative = wins / Math.max(1, games) >= 0.5;
  return (
    <SurfaceHeader
      className={c.heroSummary}
      left={
        <>
          <HeroIcon hero={hero} />
          <h3 className={c.heroName}>{heroName(hero)}</h3>
        </>
      }
      right={
        <>
          <StatRow label={t("hero_stats.popularity")} value={popularity} />

          <StatRow
            label={t("hero_stats.matches")}
            value={games}
            valueClassName="green"
          />
          <StatRow
            label={t("hero_stats.wins")}
            value={wins}
            valueClassName="green"
          />

          <StatRow
            label={t("hero_stats.winrate")}
            value={formatWinrate(wins, games - wins)}
            valueClassName={isWinrateNonNegative ? "green" : "red"}
          />
        </>
      }
    />
  );
};
