import React from "react";

import { GenericTable } from "..";
import { colors } from "@/colors";
import { AppRouter } from "@/route";
import { ColumnType } from "@/const/tables";

interface DataPoint {
  hero: string;
  kda: number;
  wins: number;
  loss: number;
}
interface IHeroPerformanceTableProps {
  data: DataPoint[];
  className?: string;
  loading: boolean;
  steamId: string;
}

export const HeroPerformanceTable: React.FC<IHeroPerformanceTableProps> = ({
  data,
  className,
  loading,
  steamId,
}) => {
  return (
    <GenericTable
      className={className}
      isLoading={loading}
      keyProvider={(it) => it[0]}
      columns={[
        {
          type: ColumnType.Hero,
          name: "Герой",
          noname: false,
          link: (d) => AppRouter.players.playerMatches(steamId, d[0]).link,
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: "% Побед",
          color: colors.green,
        },
        {
          type: ColumnType.FloatWithBar,
          name: "KDA",
          color: colors.red,
        },
      ]}
      data={data.map((it) => [
        it.hero,
        it.loss + it.wins,
        (it.wins / Math.max(1, it.wins + it.loss)) * 100,
        it.kda,
      ])}
      placeholderRows={10}
    />
  );
};
