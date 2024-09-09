import React from "react";

import { HeroIcon, Table } from "..";
import { formatWinrate, winrate } from "@/util/math";
import cx from "classnames";
import c from "./HeroPerformanceTable.module.scss";
import { SingleWeightedBarChart } from "@/components/BarChart/BarChart";

interface DataPoint {
  hero: string;
  kda: number;
  wins: number;
  loss: number;
}
interface IHeroPerformanceTableProps {
  data: DataPoint[];
  className?: string;
}

export const HeroPerformanceTable: React.FC<IHeroPerformanceTableProps> = ({
  data,
  className,
}) => {
  if (!data.length) return;

  const maxKda = data.toSorted((a, b) => b.kda - a.kda)[0].kda;
  const maxByWinrate = data.toSorted(
    (a, b) => winrate(b.wins, b.loss) - winrate(a.wins, a.loss),
  )[0];

  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          <th>Герой</th>
          <th>Матчи</th>
          <th>% Побед</th>
          <th>КДА</th>
        </tr>
      </thead>
      <tbody>
        {data.map((it) => (
          <tr key={it.hero}>
            <td>
              <HeroIcon small hero={it.hero} />
            </td>
            <td>
              <div className={c.kda}>
                <span>{it.wins + it.loss}</span>
                <SingleWeightedBarChart
                  color={"#c23c2a"}
                  value={
                    (it.wins + it.loss) /
                    (data[0].wins + data[0].loss)
                  }
                />
              </div>
            </td>
            <td>
              <div className={c.kda}>
                <span>{formatWinrate(it.wins, it.loss)}</span>
                <SingleWeightedBarChart
                  color={"#92a525"}
                  value={
                    winrate(it.wins, it.loss) /
                    winrate(maxByWinrate.wins, maxByWinrate.loss)
                  }
                />
              </div>
            </td>
            <td>
              <div className={c.kda}>
                <span>{it.kda.toFixed(2)}</span>
                <SingleWeightedBarChart
                  color={"#F26522"}
                  value={it.kda / maxKda}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
