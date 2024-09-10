import React from "react";

import { Duration, TimeAgo } from "..";

import c from "./MatchSummary.module.scss";
import { MatchDtoModeEnum } from "@/api/back";
import cx from "classnames";
import {formatGameMode} from "@/util/gamemode";

interface IMatchSummaryProps {
  matchId: number;
  timestamp: number | string;
  duration: number;
  mode: MatchDtoModeEnum;
  winner: number;
  radiantKills: number;
  direKills: number;
}

export const MatchSummary: React.FC<IMatchSummaryProps> = ({
  matchId,
  timestamp,
  mode,
  duration,
  winner,
  radiantKills,
  direKills,
}) => {
  return (
    <>
      <div className={c.matchSummary}>
        <div className={c.primary}>Матч {matchId}</div>
        <div className={c.secondary}>
          <dl>
            <dd>{formatGameMode(mode)}</dd>
            <dt>Режим</dt>
          </dl>
          <dl>
            <dd>
              <Duration duration={duration} />
            </dd>
            <dt>Длительность</dt>
          </dl>
          <dl>
            <dd>
              <TimeAgo date={timestamp} />
            </dd>
            <dt>Матч завершен</dt>
          </dl>
        </div>
      </div>
      <div className={c.matchWinner}>
        <div
          className={cx(
            c.matchWinner__winner,
            winner === 2 ? c.radiant : c.dire,
          )}
        >
          {winner === 2 ? "Победы Сил Света" : "Победы Сил Тьмы"}
        </div>
        <div className={c.matchWinner__score}>
          <div className={c.radiant}>{radiantKills}</div>
          <div className={c.matchWinner__duration}>
            <Duration duration={duration} />
          </div>
          <div className={c.dire}>{direKills}</div>
        </div>
      </div>
    </>
  );
};
