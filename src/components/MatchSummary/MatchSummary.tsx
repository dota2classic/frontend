import React from "react";

import { Breadcrumbs, Duration, PageLink, Panel, TimeAgo } from "..";

import c from "./MatchSummary.module.scss";
import cx from "clsx";
import {
  formatDotaMode,
  formatGameMode,
  formatGameState,
} from "@/util/gamemode";
import {
  DotaGameMode,
  DotaGameRulesState,
  MatchmakingMode,
} from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { MatchSummaryScore } from "@/components/MatchSummary/MatchSummaryScore";

interface IMatchSummaryProps {
  matchId: number;
  timestamp?: number | string;
  duration: number;
  mode: MatchmakingMode;
  gameMode: DotaGameMode;
  winner?: number;
  gameState?: DotaGameRulesState;
  radiantKills: number;
  direKills: number;

  replay?: string;
}

export const MatchSummary: React.FC<IMatchSummaryProps> = ({
  matchId,
  timestamp,
  mode,
  duration,
  winner,
  radiantKills,
  direKills,
  gameMode,
  gameState,
  replay,
}) => {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.matches.index().link}>Матчи</PageLink>
            <span>Матч {matchId}</span>
          </Breadcrumbs>
        </div>
        <div className="right">
          {replay && (
            <dl>
              <dd>
                <PageLink link={AppRouter.matches.download(matchId).link}>
                  Скачать
                </PageLink>
              </dd>
              <dt>Реплей игры</dt>
            </dl>
          )}
          <dl>
            <dd>{formatDotaMode(gameMode)}</dd>
            <dt>Режим</dt>
          </dl>
          <dl>
            <dd>{formatGameMode(mode)}</dd>
            <dt>Лобби</dt>
          </dl>
          {gameState !== undefined && (
            <dl>
              <dd className="gold">{formatGameState(gameState)}</dd>
              <dt>Этап игры</dt>
            </dl>
          )}
          <dl>
            <dd>
              <Duration duration={duration} />
            </dd>
            <dt>Длительность</dt>
          </dl>
          {timestamp && (
            <dl>
              <dd>
                <TimeAgo date={timestamp} />
              </dd>
              <dt>Матч завершен</dt>
            </dl>
          )}
        </div>
      </Panel>
      <div className={c.matchWinner}>
        {winner && (
          <div
            className={cx(
              c.matchWinner__winner,
              winner === 2 ? "green" : "red",
            )}
          >
            {winner === 2 ? "Победа Сил Света" : "Победа Сил Тьмы"}
          </div>
        )}
        <MatchSummaryScore
          direKills={direKills}
          radiantKills={radiantKills}
          duration={duration}
        />
      </div>
    </>
  );
};
