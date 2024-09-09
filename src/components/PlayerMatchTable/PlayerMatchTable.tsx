import React from "react";
import {
  BarChart,
  Duration,
  HeroIcon,
  HeroName,
  PageLink,
  Table,
  TimeAgo,
} from "@/components";
import c from "./PlayerMatchTable.module.scss";
import { MatchmakingMode } from "@/const/enums";
import cx from "classnames";
import { AppRouter } from "@/route";
import {KDABarChart, SingleWeightedBarChart} from "@/components/BarChart/BarChart";
import {maxBy} from "@/util/iter";
import {formatGameMode} from "@/util/gamemode";

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
}

export const PlayerMatchTable: React.FC<IPlayerMatchTableProps> = ({
  data,
  className,
}) => {
  const maxDuration = maxBy(data, it => it.duration)
  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          <th>Герой</th>
          <th>Результат</th>
          <th>Режим</th>
          <th>Длительность</th>
          <th>УСП</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.matchId}>
            <td className={c.hero}>
              <HeroIcon small hero={item.hero} />
              <PageLink link={AppRouter.match(item.matchId).link}>
                <HeroName name={item.hero} />
              </PageLink>
            </td>
            <td>
              <div className={c.result}>
                <PageLink
                  link={AppRouter.match(item.matchId).link}
                  className={item.won ? c.result__win : c.result__lose}
                >
                  {item.won ? "Победа" : "Поражение"}
                </PageLink>
                <span className={c.timestamp} suppressHydrationWarning>
                  <TimeAgo date={item.timestamp} />
                </span>
              </div>
            </td>
            <td>{formatGameMode(item.mode)}</td>
            <td>
              <div>
              <Duration duration={item.duration} />
                <SingleWeightedBarChart color='#979797' value={item.duration / maxDuration.duration} />
              </div>
            </td>
            <td>
              <div className={c.kda}>
                <span>{item.kills}/{item.deaths}/{item.assists}</span>
                <KDABarChart kills={item.kills} deaths={item.deaths} assists={item.assists}/>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
