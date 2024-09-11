import React from "react";

import { GenericTable } from "..";
import { HeroSummaryDto } from "@/api/back";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";

interface IHeroesMetaTableProps {
  loading: boolean;
  data: HeroSummaryDto[];
}

const heroTiers = ["S", "A", "B", "C", "D"];

export const HeroesMetaTable: React.FC<IHeroesMetaTableProps> = ({
  loading,
  data,
}) => {
  const sortedByMatch = data.toSorted((a, b) => b.games - a.games);

  return (
    <GenericTable
      isLoading={loading}
      placeholderRows={109}
      keyProvider={(d) => d[0]}
      data={sortedByMatch.map((it) => [
        it.hero,
        it.games,
        (it.wins / it.games) * 100,
        (it.kills + it.assists) / (it.deaths === 0 ? 1 : it.deaths),
        `${Math.round(it.gpm)} / ${Math.round(it.xpm)}`,
        `${Math.round(it.lastHits)} / ${Math.round(it.denies)}`,
      ])}
      columns={[
        {
          type: ColumnType.Hero,
          name: "Герой",
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
        },
        {
          type: ColumnType.PercentWithBar,
          name: "Доля побед",
          color: colors.green,
        },
        {
          type: ColumnType.FloatWithBar,
          name: "KDA",
        },
        {
          type: ColumnType.Raw,
          name: "GPM/XPM",
        },
        {
          type: ColumnType.Raw,
          name: "LH/D",
        },
      ]}
    />
  );
};
