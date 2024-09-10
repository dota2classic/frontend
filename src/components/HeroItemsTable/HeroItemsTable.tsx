import React from "react";

import { ItemIcon, Table, TableRowLoading } from "..";
import { HeroItemDto } from "@/api/back";
import cx from "classnames";
import { SingleWeightedBarChart } from "@/components/BarChart/BarChart";

interface IHeroItemsTableProps {
  data: HeroItemDto[];
  loading?: boolean;
  className?: string;
}

export const HeroItemsTable: React.FC<IHeroItemsTableProps> = ({
  data,
  className,
  loading,
}) => {
  const maxGameCount = data[0]?.gameCount || 1;
  const maxWins = data[0]?.wins || 1;
  const maxWinrate = data[0]?.winrate || 1;

  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          <th style={{ width: 10 }}>Предмет</th>
          <th>Матчи</th>
          <th>Победы</th>
          <th>Доля Побед</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableRowLoading columns={4} rows={20} />
        ) : (
          data.map((it) => (
            <tr key={it.item}>
              <td>
                <ItemIcon small item={it.item} />
              </td>
              <td>
                <div>{it.gameCount}</div>
                <SingleWeightedBarChart
                  value={it.gameCount / maxGameCount}
                  color={"#92a525"}
                />
              </td>
              <td>
                <div>{it.wins}</div>
                <SingleWeightedBarChart
                  value={it.wins / maxWins}
                  color={"#92a525"}
                />
              </td>
              <td>
                <div>{(it.winrate * 100).toFixed(2)}%</div>
                <SingleWeightedBarChart
                  value={it.winrate / maxWinrate}
                  color={"red"}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};
