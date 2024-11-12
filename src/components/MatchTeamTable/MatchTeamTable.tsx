import React from "react";

import { HeroIcon, ItemIcon, NumberFormat, PageLink, Table } from "..";
import { PlayerInMatchDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "./MatchTeamTable.module.scss";
import { FaCoins } from "react-icons/fa";
import { signedNumber } from "@/util/time";
import cx from "classnames";

export type Columns =
  | "GPM"
  | "LH"
  | "K"
  | "D"
  | "A"
  | "HD"
  | "TD"
  | "NW"
  | "Items"
  | "MMR";

export const AllColumns: Columns[] = [
  "GPM",
  "LH",
  "K",
  "D",
  "A",
  "HD",
  "TD",
  "NW",
  "Items",
  "MMR",
];

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
  duration: number;
  filterColumns?: Columns[];
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = ({
  players,
  duration,
  filterColumns,
}) => {
  const hc = filterColumns
    ? AllColumns.filter((t) => !filterColumns.includes(t))
    : [];
  return (
    <Table className={"compact"}>
      <thead>
        <tr>
          <th>Герой</th>
          <th className={c.fixedWidth}>Игрок</th>
          <th
            className={cx(
              "middle",
              hc.includes("GPM") ? c.mobileHidden : undefined,
            )}
          >
            GPM/XPM
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("LH") ? c.mobileHidden : undefined,
            )}
          >
            LH/D
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("K") ? c.mobileHidden : undefined,
            )}
          >
            K
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("D") ? c.mobileHidden : undefined,
            )}
          >
            D
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("A") ? c.mobileHidden : undefined,
            )}
          >
            A
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("HD") ? c.mobileHidden : undefined,
            )}
          >
            HD
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("TD") ? c.mobileHidden : undefined,
            )}
          >
            TD
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("NW") ? c.mobileHidden : undefined,
            )}
          >
            <FaCoins color={"#C9AF1D"} />
          </th>
          <th
            className={cx(
              c.items,
              hc.includes("Items") ? c.mobileHidden : undefined,
            )}
          >
            Предметы
          </th>
          <th
            className={cx(
              "middle",
              hc.includes("MMR") ? c.mobileHidden : undefined,
            )}
          >
            ММР
          </th>
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
                <img
                  className={cx(
                    c.abandon,
                    player.abandoned && c.abandon__visible,
                  )}
                  alt={`Player ${player.user.name} abandoned`}
                  src="/abandon.png"
                />
                <span className={c.level}>{player.level}</span>
              </div>
            </td>
            <td className={c.fixedWidth}>
              <PageLink
                className={"link"}
                link={AppRouter.players.player.index(player.user.steamId).link}
              >
                {player.user.steamId.length > 2 ? player.user.name : "Бот"}
              </PageLink>
            </td>
            <td
              className={cx(
                "middle",
                hc.includes("GPM") ? c.mobileHidden : undefined,
              )}
            >
              {player.gpm}/{player.xpm}
            </td>
            <td
              className={cx(
                "middle",
                hc.includes("LH") ? c.mobileHidden : undefined,
              )}
            >
              {player.lastHits}/{player.denies}
            </td>

            <td
              className={cx(
                "middle",
                hc.includes("K") ? c.mobileHidden : undefined,
              )}
            >
              {player.kills}
            </td>
            <td
              className={cx(
                "middle",
                hc.includes("D") ? c.mobileHidden : undefined,
              )}
            >
              {player.deaths}
            </td>
            <td
              className={cx(
                "middle",
                hc.includes("A") ? c.mobileHidden : undefined,
              )}
            >
              {player.assists}
            </td>

            <td
              className={cx(
                "middle",
                hc.includes("HD") ? c.mobileHidden : undefined,
              )}
            >
              <NumberFormat number={player.heroDamage} />
            </td>
            <td
              className={cx(
                "middle",
                hc.includes("TD") ? c.mobileHidden : undefined,
              )}
            >
              <NumberFormat number={player.towerDamage} />
            </td>
            <td
              className={cx(
                c.gold,
                hc.includes("NW") ? c.mobileHidden : undefined,
              )}
            >
              <NumberFormat
                number={Math.round(
                  player.gold || Math.round((player.gpm * duration) / 60) * 0.6,
                )}
              />
            </td>
            <td
              className={cx(
                c.items,
                hc.includes("Items") ? c.mobileHidden : undefined,
              )}
            >
              <ItemIcon item={player.item0} />
              <ItemIcon item={player.item1} />
              <ItemIcon item={player.item2} />
              <ItemIcon item={player.item3} />
              <ItemIcon item={player.item4} />
              <ItemIcon item={player.item5} />
            </td>
            <td className={hc.includes("MMR") ? c.mobileHidden : undefined}>
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
