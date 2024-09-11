import React from "react";
import { Duration, GenericTable, PageLink, TimeAgo } from "@/components";
import c from "./PlayerMatchTable.module.scss";
import { MatchmakingMode } from "@/const/enums";
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
}

interface IPlayerMatchTableProps {
  data: PlayerMatchItem[];
  className?: string;
  loading: boolean;
}

export const PlayerMatchTable: React.FC<IPlayerMatchTableProps> = ({
  data,
  className,
  loading,
}) => {
  return (
    <GenericTable
      placeholderRows={25}
      keyProvider={(it) => it[5]}
      columns={[
        {
          type: ColumnType.Hero,
          name: "Герой",
          link: (d) => AppRouter.match(d[5]).link,
        },
        {
          type: ColumnType.Raw,
          name: "Результат",
          format: ({ won, matchId, timestamp }) => (
            <div className={c.result}>
              <PageLink
                link={AppRouter.match(matchId).link}
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
      ]}
      data={data.map((it) => [
        it.hero,
        { won: it.won, timestamp: it.timestamp, matchId: it.matchId },
        it.mode,
        it.duration,
        it,
        it.matchId,
      ])}
      className={className}
      isLoading={loading}
    />
  );
};
