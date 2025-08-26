import React from "react";

import { GenericTable } from "..";
import { colors } from "@/colors";
import { AppRouter } from "@/route";
import { ColumnType } from "@/const/tables";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <GenericTable
      className={className}
      isLoading={loading}
      keyProvider={(it) => it[0]}
      columns={[
        {
          type: ColumnType.Hero,
          name: t("hero_performance_table.hero"),
          noname: false,
          link: (d) => AppRouter.players.playerMatches(steamId, d[0]).link,
        },
        {
          type: ColumnType.IntWithBar,
          name: t("hero_performance_table.matches"),
          color: colors.green,
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("hero_performance_table.winPercentage"),
          color: colors.green,
        },
        {
          type: ColumnType.FloatWithBar,
          name: t("hero_performance_table.kda"),
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
