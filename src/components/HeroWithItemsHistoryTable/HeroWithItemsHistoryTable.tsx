import React from "react";
import { Duration, GenericTable, PageLink, TimeAgo } from "@/components";
import c from "./HeroWithItemsHistoryTable.module.scss";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { KDABarChart } from "@/components/BarChart/BarChart";
import { formatGameMode } from "@/util/gamemode";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";

export interface PlayerMatchItem {
  hero: string;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  timestamp: number | string;
  level: number;
  won: boolean;
  mode: MatchmakingMode;
  matchId: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
}

interface IPlayerMatchTableProps {
  data: PlayerMatchItem[];
  className?: string;
  withItems?: boolean;
  loading: boolean;
}

export const HeroWithItemsHistoryTable: React.FC<IPlayerMatchTableProps> = ({
  data,
  className,
  loading,
  withItems,
}) => {
  return (
    <GenericTable
      placeholderRows={25}
      keyProvider={(it) => it[6]}
      columns={[
        {
          type: ColumnType.Hero,
          name: "Герой",
          link: (d) => AppRouter.matches.match(d[6]).link,
        },
        {
          type: ColumnType.Raw,
          name: "Результат",
          format: ({ won, matchId, timestamp }) => (
            <div className={c.result}>
              <PageLink
                link={AppRouter.matches.match(matchId).link}
                className={won ? c.result__win : c.result__lose}
              >
                {won ? "Победа" : "Поражение"}
              </PageLink>
              <span className={c.timestamp} suppressHydrationWarning>
                <TimeAgo date={timestamp} />
              </span>
            </div>
          ),
        },
        {
          type: ColumnType.Raw,
          name: "Режим",
          format: formatGameMode,
        },

        {
          type: ColumnType.IntWithBar,
          name: "Длительность",
          format: (dur) => <Duration duration={dur} />,
          color: colors.grey,
        },
        {
          type: ColumnType.Raw,
          name: "KDA",
          format: (item) => (
            <div className={c.kda}>
              <span>
                {item.kills}/{item.deaths}/{item.assists}
              </span>
              <KDABarChart
                kills={item.kills}
                deaths={item.deaths}
                assists={item.assists}
              />
            </div>
          ),
        },
        ...(withItems
          ? [
              {
                type: ColumnType.Items,
                name: "Предметы",
              },
            ]
          : []),
      ]}
      data={data.map((it) => [
        it.hero,
        { won: it.won, timestamp: it.timestamp, matchId: it.matchId },
        it.mode,
        it.duration,
        it,
        [it.item0, it.item1, it.item2, it.item3, it.item4, it.item5],
        it.matchId,
      ])}
      className={className}
      isLoading={loading}
    />
  );
};
