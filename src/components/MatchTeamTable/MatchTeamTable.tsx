import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { getMaxMatchValues } from "@/util/useMaxMatchValues";
import { pluralize } from "@/util/pluralize";

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
    const { hasReports, parsedToken } = useStore().auth;
    const { t } = useTranslation();

    const maxValues = useMemo(
      () => globalMaxValues ?? getMaxMatchValues(players, duration),
      [duration, globalMaxValues, players],
    );

    const sortedPlayers = useMemo(
      () => [...players].sort((a, b) => a.partyIndex - b.partyIndex),
      [players],
    );

    const hc = filterColumns
      ? AllColumns.filter((t) => !filterColumns.includes(t))
      : [];
    return (
      <Table className="compact">
        <thead>
          <tr>
            <th>{t("match_team_table.header.hero")}</th>
            <th className={c.fixedWidth}>
              {t("match_team_table.header.player")}
            </th>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.gpmXpm")}
              className={cx(
                "middle",
                hc.includes("GPM") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.gpm_xpm")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.lastHitsDenies")}
              className={cx(
                "middle",
                hc.includes("LH") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.lastHitsDenies")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.kills")}
              className={cx(
                "middle",
                hc.includes("K") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.kills")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.deaths")}
              className={cx(
                "middle",
                hc.includes("D") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.deaths")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.assists")}
              className={cx(
                "middle",
                hc.includes("A") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.assists")}</th>
            </Tooltipable>

            <Tooltipable
              tooltip={t("match_team_table.tooltip.heroDamage")}
              className={cx(
                "middle",
                hc.includes("HD") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.heroDamage")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.heroHealing")}
              className={cx(
                "middle",
                hc.includes("HH") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.heroHealing")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.towerDamage")}
              className={cx(
                "middle",
                hc.includes("TD") ? c.mobileHidden : undefined,
              )}
            >
              <th>{t("match_team_table.header.towerDamage")}</th>
            </Tooltipable>
            <Tooltipable
              tooltip={t("match_team_table.tooltip.gold")}
              className={cx(
                "middle",
                hc.includes("NW") ? c.mobileHidden : undefined,
              )}
            >
              <th>
                <FaCoins color="#C9AF1D" />
              </th>
            </Tooltipable>
            <th
              className={cx(
                c.items,
                hc.includes("Items") ? c.mobileHidden : undefined,
              )}
            >
              {t("match_team_table.header.items")}
            </th>
            <th className={hc.includes("MMR") ? c.mobileHidden : undefined}>
              {t("match_team_table.header.mmr")}
            </th>
            <th
              className={cx(
                "middle",
                hc.includes("Actions") ? c.mobileHidden : undefined,
              )}
            >
              <Tooltipable tooltip={t("match_team_table.tooltip.actions")}>
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

            const isInParty =
              player.user.steamId.length > 2 &&
              player.partyIndex !== -1 &&
              (iFirstPartyPlayer !== idx || idx !== iLastPartyPlayer);

            const shouldDisplay =
              !filterColumns || !filterColumns.includes("Items");

            const shouldDisplayStart =
              iFirstPartyPlayer === idx && idx !== iLastPartyPlayer;
            const shouldDisplayMiddle =
              iFirstPartyPlayer !== idx && idx !== iLastPartyPlayer;
            const shouldDisplayEnd =
              iFirstPartyPlayer !== idx && idx === iLastPartyPlayer;

            const isStreak =
              Math.abs(player.mmr?.streak || 0) >= 2 &&
              Math.sign(player.mmr?.streak || 1) ===
                Math.sign(player?.mmr?.change || -1);
            const absStreak = Math.abs(player.mmr?.streak || 0) + 1;

            return (
              <tr key={player.user.steamId}>
                <td>
                  <div
                    className={cx(c.heroWithLevel)}
                    title={heroName(player.hero)}
                  >
                    {isInParty && (
                      <span className={c.party__indicator_root}>
                        <span
                          className={cx(
                            c.party__indicator,
                            shouldDisplay && c.party__indicator__mobile_display,
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
                      alt={t("match_team_table.hero.abandoned", {
                        name: player.user.name,
                      })}
                      src="/abandon.png"
                    />
                    <span className={c.level}>{player.level}</span>
                  </div>
                </td>
                <td>
                  <div className={c.fixedWidth}>
                    <Username user={player.user} />
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
                    player.deaths === maxValues.deaths && c.underline,
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
                        <div className={c.mmrTooltip}>
                          <span>
                            {player.mmr.calibration
                              ? "Калибровочная игра"
                              : "Обычная игра "}
                          </span>
                          {isStreak && (
                            <span>
                              {player.mmr.streak > 0
                                ? `${absStreak} ${pluralize(absStreak, "победа", "победы", "побед")} подряд!`
                                : `${absStreak} ${pluralize(absStreak, "поражение", "поражения", "поражений")} подряд!`}
                            </span>
                          )}
                        </div>
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
                            player.mmr.calibration && "gold",
                            isStreak && c.streak,
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
                    {player.user.steamId.length > 2 &&
                      parsedToken?.sub !== player.user.steamId && (
                        <Tooltipable
                          className={cx(c.commend, "adminicon")}
                          tooltip={t("match_team_table.tooltip.report")}
                        >
                          <GiFist onClick={() => onReport(player)} />
                        </Tooltipable>
                      )}
                    {hasReports &&
                      reportableSteamIds.includes(player.user.steamId) && (
                        <Tooltipable
                          className={cx(c.commend, "adminicon")}
                          tooltip={t("match_team_table.tooltip.feedback")}
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
