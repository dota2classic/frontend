import React from "react";

import { GenericTable } from "..";
import { HeroSummaryDto } from "@/api/back";
import { winrate } from "@/util/math";
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
    <GenericTable
      isLoading={loading}
      placeholderRows={109}
      keyProvider={(d) => d[0]}
      data={data.map((it) => [
        it.hero,
        it.games,
        (it.wins / it.games) * 100,
        (it.kills + it.assists) / Math.max(1, it.deaths),
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
