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
import { Username } from "../Username/Username";
import heroName from "@/util/heroName";

interface IMatchTeamTableProps {
  players: PlayerInMatchDto[];
  duration: number;
  filterColumns?: Columns[];
  reportableSteamIds: string[];
  onFeedback: (plr: PlayerInMatchDto) => void;
  onReport: (plr: PlayerInMatchDto) => void;
  globalMaxValues?: Record<string, number>;
}

export const MatchTeamTable: React.FC<IMatchTeamTableProps> = observer(
  ({
    players,
    duration,
    filterColumns,
    reportableSteamIds,
    onFeedback,
    onReport,
    globalMaxValues,
  }) => {
    const { hasReports } = useStore().auth;

    const maxValues =
      globalMaxValues ??
      useMemo(() => {
        const mx: Record<string, number> = {
          gpm: 0,
          xpm: 0,
          lastHits: 0,
          denies: 0,
          kills: 0,
          deaths: Infinity,
          assists: 0,
          heroDamage: 0,
          heroHealing: 0,
          towerDamage: 0,
          gold: 0,
        };
        for (const p of players) {
          mx.gpm = Math.max(mx.gpm, p.gpm);
          mx.xpm = Math.max(mx.xpm, p.xpm);
          mx.lastHits = Math.max(mx.lastHits, p.lastHits);
          mx.denies = Math.max(mx.denies, p.denies);
          mx.kills = Math.max(mx.kills, p.kills);
          mx.deaths = Math.min(mx.deaths, p.deaths);
          mx.assists = Math.max(mx.assists, p.assists);
          mx.heroDamage = Math.max(mx.heroDamage, p.heroDamage);
          mx.heroHealing = Math.max(mx.heroHealing, p.heroHealing);
          mx.towerDamage = Math.max(mx.towerDamage, p.towerDamage);
          const goldValue = Math.round(
            p.gold || Math.round((p.gpm * duration) / 60) * 0.6,
          );
          mx.gold = Math.max(mx.gold, goldValue);
        }
        return mx;
      }, [players, duration]);

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
                  <div
                    className={cx(c.heroWithLevel)}
                    title={heroName(player.hero)}
                  >
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
                <td>
                  <div className={c.fixedWidth}>
                    <Username user={player.user} block />
                  </div>
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("GPM") ? c.mobileHidden : undefined,
                  )}
                >
                  <span
                    className={cx(
                      player.gpm > 0 &&
                        player.gpm === maxValues.gpm &&
                        c.underline,
                    )}
                  >
                    {player.gpm}
                  </span>
                  /
                  <span
                    className={cx(
                      player.xpm > 0 &&
                        player.xpm === maxValues.xpm &&
                        c.underline,
                    )}
                  >
                    {player.xpm}
                  </span>
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("LH") ? c.mobileHidden : undefined,
                  )}
                >
                  <span
                    className={cx(
                      player.lastHits > 0 &&
                        player.lastHits === maxValues.lastHits &&
                        c.underline,
                    )}
                  >
                    {player.lastHits}
                  </span>
                  /
                  <span
                    className={cx(
                      player.denies > 0 &&
                        player.denies === maxValues.denies &&
                        c.underline,
                    )}
                  >
                    {player.denies}
                  </span>
                </td>

                <td
                  className={cx(
                    "middle",
                    hc.includes("K") ? c.mobileHidden : undefined,
                    player.kills > 0 &&
                      player.kills === maxValues.kills &&
                      c.underline,
                  )}
                >
                  {player.kills}
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("D") ? c.mobileHidden : undefined,
                    player.deaths === maxValues.deaths &&
                      c.underline,
                  )}
                >
                  {player.deaths}
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("A") ? c.mobileHidden : undefined,
                    player.assists > 0 &&
                      player.assists === maxValues.assists &&
                      c.underline,
                  )}
                >
                  {player.assists}
                </td>

                <td
                  className={cx(
                    "middle",
                    hc.includes("HD") ? c.mobileHidden : undefined,
                    player.heroDamage > 0 &&
                      player.heroDamage === maxValues.heroDamage &&
                      c.underline,
                  )}
                >
                  <NumberFormat number={player.heroDamage} />
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("HH") ? c.mobileHidden : undefined,
                    player.heroHealing > 0 &&
                      player.heroHealing === maxValues.heroHealing &&
                      c.underline,
                  )}
                >
                  <NumberFormat number={player.heroHealing} />
                </td>
                <td
                  className={cx(
                    "middle",
                    hc.includes("TD") ? c.mobileHidden : undefined,
                    player.towerDamage > 0 &&
                      player.towerDamage === maxValues.towerDamage &&
                      c.underline,
                  )}
                >
                  <NumberFormat number={player.towerDamage} />
                </td>
                <td
                  className={cx(
                    c.gold,
                    hc.includes("NW") ? c.mobileHidden : undefined,
                    player.gold > 0 &&
                      player.gold === maxValues.gold &&
                      c.underline,
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
                  <div className={c.actions}>
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
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  },
);
