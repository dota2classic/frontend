import React from "react";

import c from "./MatchSummary.module.scss";
import cx from "clsx";
import {
  DotaGameMode,
  DotaGameRulesState,
  MatchmakingMode,
} from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { MatchSummaryScore } from "./MatchSummaryScore";
import { observer } from "mobx-react-lite";
import { useIsModerator } from "@/util/useIsAdmin";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";
import { Duration } from "../Duration";
import { TimeAgo } from "../TimeAgo";
import { PageHeader } from "../PageHeader";
import { MetaStat } from "../MetaStat";

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

export const MatchSummary: React.FC<IMatchSummaryProps> = observer(
  ({
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
    const { t } = useTranslation();
    const isMod = useIsModerator();

    return (
      <>
        <PageHeader
          breadcrumbs={
            <>
              <PageLink link={AppRouter.matches.index().link}>
                {t("match_summary.matches")}
              </PageLink>
              <span>{t("match_summary.matchNumber", { matchId })}</span>
            </>
          }
          actions={
            <>
              {isMod && (
                <MetaStat
                  label={t("match_summary.log")}
                  value={
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        getApi()
                          .adminApi.adminUserControllerLogFile(
                            matchId.toString(),
                          )
                          .then((res) => {
                            const wnd = window.open(
                              "about:blank",
                              "",
                              "_blank",
                            );
                            wnd?.document?.write(res);
                          });
                      }}
                    >
                      {t("match_summary.view")}
                    </a>
                  }
                />
              )}
              {replay && (
                <MetaStat
                  label={t("match_summary.replay")}
                  value={
                    <PageLink link={AppRouter.matches.download(matchId).link}>
                      {t("match_summary.download")}
                    </PageLink>
                  }
                />
              )}
              <MetaStat
                label={t("match_summary.mode")}
                value={t(`game_mode.${gameMode}`)}
              />
              <MetaStat
                label={t("match_summary.lobby")}
                value={t(`matchmaking_mode.${mode}`)}
              />
              {gameState !== undefined && (
                <MetaStat
                  label={t("match_summary.gameStage")}
                  value={
                    <span className="gold">{t(`game_state.${gameState}`)}</span>
                  }
                />
              )}
              <MetaStat
                label={t("match_summary.duration")}
                value={<Duration clock duration={duration} />}
              />
              {timestamp && (
                <MetaStat
                  label={t("match_summary.matchEnded")}
                  value={<TimeAgo date={timestamp} />}
                />
              )}
            </>
          }
        />
        <div className={c.matchWinner}>
          {winner && (
            <div
              className={cx(
                c.matchWinner__winner,
                winner === 2 ? "green" : "red",
              )}
            >
              {winner === 2
                ? t("match_summary.victoryRadiant")
                : t("match_summary.victoryDire")}
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
  },
);
