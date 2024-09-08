import React from "react";

import { HeroIcon, ItemIcon, NumberFormat, PageLink, Table } from "..";
import { PlayerInMatchDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "./MatchTeamTable.module.scss";
import { FaCoins } from "react-icons/fa";

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
  duration: number;
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = ({
  players,
  duration,
}) => {
  return (
    <Table className={"compact"}>
      <thead>
        <tr>
          <th>Герой</th>
          <th>Игрок</th>
          <th className="middle">GPM/XPM</th>
          <th className="middle">LH/D</th>
          <th className="middle">K</th>
          <th className="middle">D</th>
          <th className="middle">A</th>
          <th className="middle">
            <FaCoins color={"#C9AF1D"} />
          </th>
          <th>Предметы</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.steam_id}>
            <td>
              <div className={c.heroWithLevel}>
                <HeroIcon hero={player.hero} />
                <span className={c.level}>{player.level}</span>
              </div>
            </td>
            <td>
              <PageLink link={AppRouter.player(player.steam_id).link}>
                {player.name}
              </PageLink>
            </td>
            <td className="middle">
              {player.gpm}/{player.xpm}
            </td>
            <td className="middle">
              {player.last_hits}/{player.denies}
            </td>

            <td className="middle">{player.kills}</td>
            <td className="middle">{player.deaths}</td>
            <td className="middle">{player.assists}</td>
            <td className={c.gold}>
              <NumberFormat
                number={
                  player.networth || Math.round((player.gpm * duration) / 60)
                }
              />
            </td>
            <td>
              {player.items.map((item, index) => (
                <ItemIcon key={index} item={item} />
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
