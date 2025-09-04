import React from "react";

import { GenericTable } from "../GenericTable";
import { HeroSummaryDto } from "@/api/back";
import { colors } from "@/colors";
import { ColumnType } from "@/const/tables";
import { useTranslation } from "react-i18next";

interface IHeroesMetaTableProps {
  loading: boolean;
  data: HeroSummaryDto[];
}

export const HeroesMetaTable: React.FC<IHeroesMetaTableProps> = ({
  loading,
  data,
}) => {
  const { t } = useTranslation();
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
          name: t("heroes_meta_table.hero"),
          sortable: true,
        },
        {
          type: ColumnType.IntWithBar,
          name: t("heroes_meta_table.matches"),
          sortable: true,
          defaultSort: "desc",
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("heroes_meta_table.winRate"),
          color: colors.green,
          sortable: true,
        },
        {
          type: ColumnType.PercentWithBar,
          name: t("heroes_meta_table.pickRate"),
          color: colors.grey,
          mobileOmit: true,
          sortable: true,
        },
        {
          type: ColumnType.FloatWithBar,
          name: t("heroes_meta_table.kda"),
          mobileOmit: true,
          sortable: true,
        },
        {
          type: ColumnType.PM_PAIR,
          name: t("heroes_meta_table.gpmXpm"),
          sortable: true,
          mobileOmit: true,
          sortKey(d) {
            return d[0];
          },
        },
        {
          type: ColumnType.PM_PAIR,
          name: t("heroes_meta_table.lhD"),
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
