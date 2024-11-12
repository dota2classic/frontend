import React from "react";

import { GenericTable } from "..";
import { HeroSummaryDto } from "@/api/back";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";

interface IHeroesMetaTableProps {
  loading: boolean;
  data: HeroSummaryDto[];
}

// const heroTiers = ["S", "A", "B", "C", "D"];

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
        it.pickrate * 100,
        (it.kills + it.assists) / (it.deaths === 0 ? 1 : it.deaths),
        [it.gpm, it.xpm],
        [it.lastHits, it.denies],
      ])}
      columns={[
        {
          type: ColumnType.Hero,
          name: "Герой",
          sortable: true,
        },
        {
          type: ColumnType.IntWithBar,
          name: "Матчи",
          sortable: true,
          defaultSort: "desc",
        },
        {
          type: ColumnType.PercentWithBar,
          name: "Доля побед",
          color: colors.green,
          sortable: true,
        },
        {
          type: ColumnType.PercentWithBar,
          name: "Частота выбора",
          color: colors.grey,
          mobileOmit: true,
          sortable: true,
        },
        {
          type: ColumnType.FloatWithBar,
          name: "KDA",
          mobileOmit: true,
          sortable: true,
        },
        {
          type: ColumnType.PM_PAIR,
          name: "GPM/XPM",
          sortable: true,
          mobileOmit: true,
          sortKey(d) {
            return d[0];
          },
        },
        {
          type: ColumnType.PM_PAIR,
          name: "LH/D",
          sortable: true,
          mobileOmit: true,
          sortKey(d) {
            return d[0];
          },
        },
      ]}
    />
  );
};
