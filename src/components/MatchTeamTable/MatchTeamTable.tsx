import React from "react";

import { HeroIcon, ItemIcon, PageLink, Table } from "..";
import { PlayerInMatchDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "./MatchTeamTable.module.scss";

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = ({ players }) => {
  return (
    <Table className={"compact"}>
      <thead>
        <tr>
          <th>Герой</th>
          <th>Игрок</th>
          <th>GPM/XPM</th>
          <th>LH/D</th>
          <th>K</th>
          <th>D</th>
          <th>A</th>
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
            <td>
              {player.gpm}/{player.xpm}
            </td>
            <td>
              {player.last_hits}/{player.denies}
            </td>

            <td>{player.kills}</td>
            <td>{player.deaths}</td>
            <td>{player.assists}</td>
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
