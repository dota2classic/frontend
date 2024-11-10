import React from "react";

import { HeroIcon, ItemIcon, NumberFormat, PageLink, Table } from "..";
import { PlayerInMatchDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "./MatchTeamTable.module.scss";
import { FaCoins } from "react-icons/fa";
import { signedNumber } from "@/util/time";
import cx from "classnames";
import Image from "next/image";

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
          <th className={c.fixedWidth}>Игрок</th>
          <th className="middle">GPM/XPM</th>
          <th className="middle">LH/D</th>
          <th className="middle">K</th>
          <th className="middle">D</th>
          <th className="middle">A</th>
          <th className="middle">HD</th>
          <th className="middle">TD</th>
          <th className="middle">
            <FaCoins color={"#C9AF1D"} />
          </th>
          <th>Предметы</th>
          <th className="middle">ММР</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.user.steamId}>
            <td>
              <div className={c.heroWithLevel}>
                <PageLink link={AppRouter.heroes.hero.index(player.hero).link}>
                  <HeroIcon hero={player.hero} />
                </PageLink>
                <Image
                  className={cx(
                    c.abandon,
                    player.abandoned && c.abandon__visible,
                  )}
                  alt={`Player ${player.user.name} abandoned`}
                  src="/abandon.png"
                  width={71}
                  height={18}
                />
                <span className={c.level}>{player.level}</span>
              </div>
            </td>
            <td>
              <PageLink
                className={"link"}
                link={AppRouter.players.player.index(player.user.steamId).link}
              >
                {player.user.steamId.length > 2 ? player.user.name : "Бот"}
              </PageLink>
            </td>
            <td className="middle">
              {player.gpm}/{player.xpm}
            </td>
            <td className="middle">
              {player.lastHits}/{player.denies}
            </td>

            <td className="middle">{player.kills}</td>
            <td className="middle">{player.deaths}</td>
            <td className="middle">{player.assists}</td>

            <td className="middle">
              <NumberFormat number={player.heroDamage} />
            </td>
            <td className="middle">
              <NumberFormat number={player.towerDamage} />
            </td>
            <td className={c.gold}>
              <NumberFormat
                number={Math.round(
                  player.gold || Math.round((player.gpm * duration) / 60) * 0.6,
                )}
              />
            </td>
            <td>
              <ItemIcon item={player.item0} />
              <ItemIcon item={player.item1} />
              <ItemIcon item={player.item2} />
              <ItemIcon item={player.item3} />
              <ItemIcon item={player.item4} />
              <ItemIcon item={player.item5} />
            </td>
            <td>
              {(player.mmr?.change && (
                <>
                  {player.mmr?.mmrBefore}{" "}
                  <span
                    className={
                      Math.sign(player.mmr?.change || 0) > 0 ? "green" : "red"
                    }
                  >
                    {signedNumber(player.mmr?.change || 0)}
                  </span>
                </>
              )) ||
                "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
