import React, { useMemo } from "react";

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
import { GiFist } from "react-icons/gi";
import { GrActions } from "react-icons/gr";

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
  duration: number;
  filterColumns?: Columns[];
  reportableSteamIds: string[];
  onFeedback: (plr: PlayerInMatchDto) => void;
  onReport: (plr: PlayerInMatchDto) => void;
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = observer(
  ({
    players,
    duration,
    filterColumns,
    reportableSteamIds,
    onFeedback,
    onReport,
  }) => {
    const { hasReports } = useStore().auth;

    const sortedPlayers = useMemo(
      () => [...players].sort((a, b) => a.partyIndex - b.partyIndex),
      [players],
    );

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
              tooltip="Урон по героям"
              className={cx(
                "middle",
                hc.includes("HD") ? c.mobileHidden : undefined,
              )}
            >
              <th>УГ</th>
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
            <th
              className={cx(
                "middle",
                hc.includes("Actions") ? c.mobileHidden : undefined,
              )}
            >
              <Tooltipable tooltip="Действия">
                <GrActions />
              </Tooltipable>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, idx) => {
            const iFirstPartyPlayer = sortedPlayers.findIndex(
              (t) => t.partyIndex === player.partyIndex,
            );
            const iLastPartyPlayer = sortedPlayers.findLastIndex(
              (t) => t.partyIndex === player.partyIndex,
            );

            const shouldDisplay =
              (!filterColumns || filterColumns.includes("MMR")) &&
              player.partyIndex !== -1 &&
              (iFirstPartyPlayer !== idx || idx !== iLastPartyPlayer);

            const shouldDisplayStart =
              iFirstPartyPlayer === idx && idx !== iLastPartyPlayer;
            const shouldDisplayMiddle =
              iFirstPartyPlayer !== idx && idx !== iLastPartyPlayer;
            const shouldDisplayEnd =
              iFirstPartyPlayer !== idx && idx === iLastPartyPlayer;

            return (
              <tr key={player.user.steamId}>
                <td>
                  <div className={cx(c.heroWithLevel)}>
                    {shouldDisplay && (
                      <span className={c.party__indicator_root}>
                        <span
                          className={cx(
                            c.party__indicator,
                            shouldDisplayStart && c.party__indicator__start,
                            shouldDisplayMiddle && c.party__indicator__middle,
                            shouldDisplayEnd && c.party__indicator__end,
                            `party_${player.partyIndex}`,
                          )}
                        />
                      </span>
                    )}
                    <PageLink
                      link={
                        AppRouter.players.player.index(player.user.steamId).link
                      }
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
                        player.mmr.calibration
                          ? "Калибровочная игра"
                          : "Обычная игра "
                      }
                    >
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "4px",
                        }}
                      >
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
                <td
                  className={
                    hc.includes("Actions") ? c.mobileHidden : undefined
                  }
                >
                  <Tooltipable
                    className={cx(c.commend, "adminicon")}
                    tooltip={"Жалоба"}
                  >
                    <GiFist onClick={() => onReport(player)} />
                  </Tooltipable>
                  {hasReports &&
                    reportableSteamIds.includes(player.user.steamId) && (
                      <Tooltipable
                        className={cx(c.commend, "adminicon")}
                        tooltip={"Отзыв"}
                      >
                        <MdRecommend onClick={() => onFeedback(player)} />
                      </Tooltipable>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  },
);
