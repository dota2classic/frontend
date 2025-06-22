import React from "react";
import { Duration, GenericTable, PageLink, TimeAgo } from "@/components";
import c from "./HeroWithItemsHistoryTable.module.scss";
import { DotaGameMode, MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { formatDotaMode, formatGameMode } from "@/util/gamemode";
import { colors } from "@/colors";
import cx from "clsx";
import { KDABarChart } from "@/components/BarChart/KDABarChart";
import { ColumnType } from "@/const/tables";
import { UserDTO } from "@/api/back";

export interface PlayerMatchItem {
  hero: string;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  timestamp: string;
  level: number;
  won: boolean;
  mode: MatchmakingMode;
  gameMode: DotaGameMode;
  matchId: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;

  user: UserDTO
}

interface IPlayerMatchTableProps {
  data: PlayerMatchItem[];
  className?: string;
  withItems?: boolean;
  loading: boolean;
  showUser?: boolean;
}

export const HeroWithItemsHistoryTable: React.FC<IPlayerMatchTableProps> = ({
  data,
  className,
  loading,
  withItems,
  showUser
}) => {
  return (
    <GenericTable
      placeholderRows={25}
      keyProvider={(it) => it[6]}
      columns={[
        {
          type: showUser ? ColumnType.Player : ColumnType.Hero,
          name: showUser ? "Игрок" : "Герой",
          maxWidth: 150
        },
        {
          type: ColumnType.Raw,
          name: "Результат",
          format: ({ won, matchId, timestamp }) => (
            <div className={cx(c.twoRows)}>
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
          format: ([lobby, mode]) => (
            <div className={c.twoRows}>
              <span>{formatGameMode(lobby)}</span>
              <span className={c.secondary}>{formatDotaMode(mode)}</span>
            </div>
          ),
          mobileOmit: true,
        },

        {
          type: ColumnType.IntWithBar,
          name: "Длительность",
          format: (dur) => <Duration duration={dur} />,
          color: colors.grey,
          mobileOmit: true,
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
                mobileOmit: true,
              },
            ]
          : []),
      ]}
      data={data.map((it) => [
        showUser ? it.user: it.hero,
        { won: it.won, timestamp: it.timestamp, matchId: it.matchId },
        [it.mode, it.gameMode],
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
