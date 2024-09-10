import React from "react";

import { HeroIcon, PageLink, Table, TableRowLoading } from "..";
import { HeroSummaryDto } from "@/api/back";
import { formatWinrate, winrate } from "@/util/math";
import c from "./HeroesMetaTable.module.scss";
import heroName from "@/util/heroName";
import { AppRouter } from "@/route";
import cx from "classnames";

interface IHeroesMetaTableProps {
  loading: boolean;
  data: HeroSummaryDto[];
}

const heroTiers = ["S", "A", "B", "C", "D"];

export const HeroesMetaTable: React.FC<IHeroesMetaTableProps> = ({
  loading,
  data,
}) => {
  const sortedByWinrate = data.toSorted(
    (a, b) => winrate(b.wins, b.losses) - winrate(a.wins, a.losses),
  );

  const getTier = (summary: HeroSummaryDto) => {
    const index = sortedByWinrate.indexOf(summary);
    return heroTiers[
      Math.floor((index / Math.max(1, data.length)) * heroTiers.length)
    ];
  };

  return (
    <Table className="compact">
      <thead>
        <tr>
          <th style={{ width: 20 }}>Сила</th>
          <th className="middle-adjusted">Герой</th>
          <th>Матчей</th>
          <th>% Побед</th>
          <th>КДА</th>
          <th>GPM/XPM</th>
          <th className={c.gpm}>LH/D</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableRowLoading rows={109} columns={7} />
        ) : (
          data
            .toSorted((a, b) => b.games - a.games)
            .map((it, index) => {
              const tier = getTier(it);
              return (
                <tr key={it.hero}>
                  <td>
                    <span
                      className={cx(c.tier, {
                        [c.sTier]: tier === "S",
                        [c.aTier]: tier === "A",
                        [c.bTier]: tier === "B",
                        [c.cTier]: tier === "C",
                        [c.dTier]: tier === "D",
                      })}
                    >
                      {tier}
                    </span>
                  </td>
                  <td className="middle">
                    <div className={c.hero}>
                      <HeroIcon hero={it.hero} />
                      <PageLink link={AppRouter.heroes.hero(it.hero).link}>
                        {heroName(it.hero)}
                      </PageLink>
                    </div>
                  </td>
                  <td>{it.games}</td>
                  <td>{formatWinrate(it.wins, it.losses)}</td>
                  <td>{((it.kills + it.assists) / it.deaths).toFixed(2)}</td>
                  <td className={c.gpm}>
                    {Math.round(it.gpm)}/{Math.round(it.xpm)}
                  </td>
                  <td className={c.gpm}>
                    {Math.round(it.lastHits)}/{Math.round(it.denies)}
                  </td>
                </tr>
              );
            })
        )}
      </tbody>
    </Table>
  );
};
