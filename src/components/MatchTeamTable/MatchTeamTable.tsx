import React from "react";

import {
  HeroIcon,
  ItemIcon,
  NumberFormat,
  PageLink,
  Table,
  Tooltipable,
} from "..";
import { PlayerInMatchDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "./MatchTeamTable.module.scss";
import { FaCoins } from "react-icons/fa";
import { signedNumber } from "@/util/time";
import cx from "clsx";
import { AllColumns, Columns } from "./columns";
import { MdRecommend } from "react-icons/md";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
  duration: number;
  filterColumns?: Columns[];
  reportable: boolean;
  onTryReport: (plr: PlayerInMatchDto) => void;
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = observer(
  ({ players, duration, filterColumns, reportable, onTryReport }) => {
    const { hasReports, me } = useStore().auth;

    const hc = filterColumns
      ? AllColumns.filter((t) => !filterColumns.includes(t))
      : [];
    return (
      <Table className={"compact"}>
        <thead>
          <tr>
            <th>Герой</th>
            <th className={c.fixedWidth}>Игрок</th>
            <Tooltipable
              tooltip="Золото в минуту / Опыт в минуту"
              className={cx(
                "middle",
                hc.includes("GPM") ? c.mobileHidden : undefined,
              )}
            >
              <th>ЗВМ/ОВМ</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Добито / Не отдано"
              className={cx(
                "middle",
                hc.includes("LH") ? c.mobileHidden : undefined,
              )}
            >
              <th>Д/НО</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Убийств"
              className={cx(
                "middle",
                hc.includes("K") ? c.mobileHidden : undefined,
              )}
            >
              <th>У</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Смертей"
              className={cx(
                "middle",
                hc.includes("D") ? c.mobileHidden : undefined,
              )}
            >
              <th>С</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Помощи в убийствах"
              className={cx(
                "middle",
                hc.includes("A") ? c.mobileHidden : undefined,
              )}
            >
              <th>П</th>
            </Tooltipable>

            <Tooltipable
              tooltip="Лечение"
              className={cx(
                "middle",
                hc.includes("HH") ? c.mobileHidden : undefined,
              )}
            >
              <th>Л</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Урон по героям"
              className={cx(
                "middle",
                hc.includes("HD") ? c.mobileHidden : undefined,
              )}
            >
              <th>УГ</th>
            </Tooltipable>
            <Tooltipable
              tooltip="Урон по строениям"
              className={cx(
                "middle",
                hc.includes("TD") ? c.mobileHidden : undefined,
              )}
            >
              <th>УС</th>
            </Tooltipable>
            <Tooltipable
              tooltip={"Общая стоимость"}
              className={cx(
                "middle",
                hc.includes("NW") ? c.mobileHidden : undefined,
              )}
            >
              <th>
                <FaCoins color={"#C9AF1D"} />
              </th>
            </Tooltipable>
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
                  <PageLink
                    link={AppRouter.heroes.hero.index(player.hero).link}
                  >
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
                  link={
                    AppRouter.players.player.index(player.user.steamId).link
                  }
                >
                  {player.user.steamId.length > 2 ? player.user.name : "Бот"}
                </PageLink>
                {reportable && hasReports && me?.id !== player.user.steamId && (
                  <MdRecommend
                    onClick={() => onTryReport(player)}
                    className={cx(c.commend, "adminicon")}
                  />
                )}
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
                  hc.includes("HH") ? c.mobileHidden : undefined,
                )}
              >
                <NumberFormat number={player.heroHealing} />
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
                    player.gold ||
                      Math.round((player.gpm * duration) / 60) * 0.6,
                  )}
                />
              </td>
              <td
                className={cx(
                  c.items,
                  hc.includes("Items") ? c.mobileHidden : undefined,
                )}
              >
                <div className={c.itemsWrapper}>
                  <ItemIcon item={player.item0} />
                  <ItemIcon item={player.item1} />
                  <ItemIcon item={player.item2} />
                  <ItemIcon item={player.item3} />
                  <ItemIcon item={player.item4} />
                  <ItemIcon item={player.item5} />
                </div>
              </td>
              <td className={hc.includes("MMR") ? c.mobileHidden : undefined}>
                {(player.mmr?.change && (
                  <Tooltipable
                    tooltip={
                      Math.abs(player.mmr.change) >= 50
                        ? "Калибровочная игра"
                        : "Обычная игра "
                    }
                  >
                    <span>
                      {player.mmr?.mmrBefore}{" "}
                      <span
                        className={cx(
                          Math.sign(player.mmr?.change || 0) > 0
                            ? "green"
                            : "red",
                          Math.abs(player.mmr.change) >= 50 && "gold",
                        )}
                      >
                        {signedNumber(player.mmr?.change || 0)}
                      </span>
                    </span>
                  </Tooltipable>
                )) ||
                  "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
);
