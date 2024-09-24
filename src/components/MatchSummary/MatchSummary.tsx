import React from "react";

import { Duration, Panel, TimeAgo } from "..";

import c from "./MatchSummary.module.scss";
import { MatchDtoModeEnum } from "@/api/back";
import cx from "classnames";
import { formatGameMode } from "@/util/gamemode";

interface IMatchSummaryProps {
  matchId: number;
  timestamp: number | string;
  duration: number;
  mode: MatchDtoModeEnum;
  winner: number;
  radiantKills: number;
  direKills: number;
}

export const MatchSummaryScore = ({
  radiantKills,
  direKills,
  duration,
}: {
  radiantKills: number;
  direKills: number;
  duration: number;
}) => {
  return (
    <div className={c.matchWinner__score}>
      <div className={c.radiant}>{radiantKills}</div>
      <div className={c.matchWinner__duration}>
        <Duration duration={duration} />
      </div>
      <div className={c.dire}>{direKills}</div>
    </div>
  );
};

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
      <Panel>
        <div className="left">Матч {matchId}</div>
        <div className="right">
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
      </Panel>
      <div className={c.matchWinner}>
        <div
          className={cx(c.matchWinner__winner, winner === 2 ? "green" : "red")}
        >
          {winner === 2 ? "Победы Сил Света" : "Победы Сил Тьмы"}
        </div>
        <MatchSummaryScore
          direKills={direKills}
          radiantKills={radiantKills}
          duration={duration}
        />
      </div>
    </>
  );
};
