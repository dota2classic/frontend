import React, { useMemo, useState } from "react";

import c from "./PlayerPentagonStats.module.scss";
import { PlayerAspect } from "@/api/mapped-models";
import { formatPlayerAspect } from "@/util/gamemode";
import { formatWinrate } from "@/util/math";
import { PlayerAspectIcons } from "@/containers/PlayerFeedbackModal/PlayerAspectIcons";
import { useTranslation } from "react-i18next";
import { Tooltipable } from "../Tooltipable";
import { Duration } from "../Duration";

interface IPlayerPentagonStatsProps {
  aspects: {
    aspect: PlayerAspect;
    count: number;
  }[];

  kills: number;
  deaths: number;
  assists: number;
  playtime: number;
  abandons: number;
  wins: number;

  games: number;
}

export const PlayerPentagonStats: React.FC<IPlayerPentagonStatsProps> = ({
  aspects,
  kills,
  deaths,
  assists,
  abandons,
  playtime,
  games,
  wins,
}) => {
  const { t } = useTranslation();
  const [side, setSide] = useState(-1);
  const outerPentaSize = 0.36;

  const abandonRate = abandons / Math.max(1, games);

  const sortedAspects = useMemo(() => {
    const max = Math.max(
      aspects.sort((a, b) => b.count - a.count)[0].count || 0,
      1,
    );
    return aspects.map(({ aspect, count }, i) => {
      const magnitude = Math.max(0.2, count / max);
      const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        magnitude,
        aspect,
        count,
        Icon: PlayerAspectIcons.find((t) => t.aspect === aspect)!.Icon,
      };
    });
  }, [aspects]);

  return (
    <div className={c.stats}>
      <div className={c.pentagon}>
        <header>{t("player_pentagon_stats.reviews")}</header>
        <div
          className={c.pentagon__visual}
          ref={(e) => {
            if (e) {
              setSide(e.getBoundingClientRect().width);
            }
          }}
        >
          {side > 0 && (
            <svg
              className={c.svg}
              xmlns="http://www.w3.org/2000/svg"
              width={side}
              height={side}
            >
              <defs>
                <radialGradient id="grad">
                  <stop offset="5%" stopColor="#ff000070" />
                  <stop offset="90%" stopColor="#ffde044a" />
                </radialGradient>
              </defs>
              <polygon
                className={c.svg__big_penta}
                points={sortedAspects
                  .map(
                    ({ x, y }) =>
                      `${side / 2 + x * side * outerPentaSize},${side / 2 + y * side * outerPentaSize}`,
                  )
                  .join(" ")}
              />
              {sortedAspects.map(({ x, y, aspect }) => (
                <line
                  key={aspect}
                  x1={side / 2}
                  y1={side / 2}
                  x2={side / 2 + x * side * outerPentaSize}
                  y2={side / 2 + y * side * outerPentaSize}
                  stroke="black"
                />
              ))}
              <polygon
                className={c.svg__small_penta}
                points={sortedAspects
                  .map(
                    ({ x, y, magnitude }) =>
                      `${side / 2 + x * side * outerPentaSize * magnitude},${side / 2 + y * side * outerPentaSize * magnitude}`,
                  )
                  .join(" ")}
              />
            </svg>
          )}
          <span>
            {sortedAspects.map(({ x, y, magnitude, aspect, count }) => (
              <Tooltipable
                key={aspect}
                tooltip={`${formatPlayerAspect(aspect)}: ${count}`}
                className={c.dot}
              >
                <div
                  style={{
                    left: `calc(50% + ${x * outerPentaSize * 98 * magnitude}%)`,
                    top: `calc(50% + ${y * outerPentaSize * 98 * magnitude}%)`,
                  }}
                />
              </Tooltipable>
            ))}
          </span>
          <span>
            {sortedAspects.map(({ x, y, aspect }) => (
              <div
                key={aspect}
                className={c.aspect}
                style={{
                  left: `calc(50% + ${x * outerPentaSize * 110}%)`,
                  top: `calc(50% + ${y * outerPentaSize * 110}%)`,
                }}
              >
                {formatPlayerAspect(aspect)}
              </div>
            ))}
          </span>
        </div>
      </div>

      <div className={c.statsContainer}>
        <header>{t("player_pentagon_stats.seasonStats")}</header>
        <div className={c.numericalStats}>
          <dl>
            <dd>{kills.toFixed(2)}</dd>
            <dt>{t("player_pentagon_stats.kills")}</dt>
          </dl>
          <dl>
            <dd>{deaths.toFixed(2)}</dd>
            <dt>{t("player_pentagon_stats.deaths")}</dt>
          </dl>
          <dl>
            <dd>{assists.toFixed(2)}</dd>
            <dt>{t("player_pentagon_stats.assists")}</dt>
          </dl>
          <span className={c.delimiter} />

          <dl>
            <dd>{games}</dd>
            <dt>{t("player_pentagon_stats.gamesPlayed")}</dt>
          </dl>
          <dl>
            <dd>{formatWinrate(wins, games - wins)}</dd>
            <dt>{t("player_pentagon_stats.winRate")}</dt>
          </dl>
          <dl>
            <dd>{(abandonRate * 100).toFixed(1)}%</dd>
            <dt>{t("player_pentagon_stats.abandonedGames")}</dt>
          </dl>
          <dl>
            <dd>
              <Duration big duration={playtime} />
            </dd>
            <dt>{t("player_pentagon_stats.playtime")}</dt>
          </dl>
        </div>
      </div>
    </div>
  );
};
