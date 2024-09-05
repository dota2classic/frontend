import React from "react";
import {Duration, HeroIcon, Table, TimeAgo} from "@/components";
import c from "./PlayerMatchTable.module.scss";
import { MatchmakingMode } from "@/const/enums";

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
}

interface IPlayerMatchTableProps {
  data: Item[];
}

export const PlayerMatchTable: React.FC<IPlayerMatchTableProps> = ({
  data,
}) => {
  return (
    <Table>
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
          <tr>
            <td className={c.hero}>
              <HeroIcon hero={item.hero} />
              <span>{item.hero}</span>
            </td>
            <td>
              <div className={c.result}>
                <span className={item.won ? c.result__win : c.result__lose}>
                  {item.won ? "Победа" : "Поражение"}
                </span>
                <span className={c.timestamp} suppressHydrationWarning>
                  <TimeAgo date={item.timestamp} />
                </span>
              </div>
            </td>
            <td>All pick</td>
            <td><Duration duration={item.duration * 1000} /></td>
            <td>{item.kills}/{item.deaths}/{item.assists}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
