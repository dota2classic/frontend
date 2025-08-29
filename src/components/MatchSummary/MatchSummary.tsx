import React from "react";

import { Breadcrumbs, Duration, PageLink, Panel, TimeAgo } from "..";

import c from "./MatchSummary.module.scss";
import cx from "clsx";
import {
  DotaGameMode,
  DotaGameRulesState,
  MatchmakingMode,
} from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { MatchSummaryScore } from "@/components/MatchSummary/MatchSummaryScore";
import { observer } from "mobx-react-lite";
import { useIsModerator } from "@/util";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";

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
        <Panel style={{ flexDirection: "row" }}>
          <div className="left">
            <Breadcrumbs>
              <PageLink link={AppRouter.matches.index().link}>
                {t("match_summary.matches")}
              </PageLink>
              <span>{t("match_summary.matchNumber", { matchId })}</span>
            </Breadcrumbs>
          </div>
          <div className="right">
            {isMod && (
              <dl>
                <dd>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      getApi()
                        .adminApi.adminUserControllerLogFile(matchId.toString())
                        .then((res) => {
                          const wnd = window.open("about:blank", "", "_blank");
                          wnd?.document?.write(res);
                        });
                    }}
                  >
                    {t("match_summary.view")}
                  </a>
                </dd>
                <dt>{t("match_summary.log")}</dt>
              </dl>
            )}
            {replay && (
              <dl>
                <dd>
                  <PageLink link={AppRouter.matches.download(matchId).link}>
                    {t("match_summary.download")}
                  </PageLink>
                </dd>
                <dt>{t("match_summary.replay")}</dt>
              </dl>
            )}
            <dl>
              <dd>{t(`game_mode.${gameMode}`)}</dd>
              <dt>{t("match_summary.mode")}</dt>
            </dl>
            <dl>
              <dd>{t(`matchmaking_mode.${mode}`)}</dd>
              <dt>{t("match_summary.lobby")}</dt>
            </dl>
            {gameState !== undefined && (
              <dl>
                <dd className="gold">{t(`game_state.${gameState}`)}</dd>
                <dt>{t("match_summary.gameStage")}</dt>
              </dl>
            )}
            <dl>
              <dd>
                <Duration duration={duration} />
              </dd>
              <dt>{t("match_summary.duration")}</dt>
            </dl>
            {timestamp && (
              <dl>
                <dd>
                  <TimeAgo date={timestamp} />
                </dd>
                <dt>{t("match_summary.matchEnded")}</dt>
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
