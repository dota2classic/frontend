import React from "react";
import {
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

interface Item {
  hero: string;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  timestamp: number;
  level: number;
  won: boolean;
  mode: MatchmakingMode;
  matchId: number;
}

interface IPlayerMatchTableProps {
  data: Item[];
  className?: string;
}

export const PlayerMatchTable: React.FC<IPlayerMatchTableProps> = ({
  data,
  className,
}) => {
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
            <td>All pick</td>
            <td>
              <Duration duration={item.duration} />
            </td>
            <td>
              {item.kills}/{item.deaths}/{item.assists}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
