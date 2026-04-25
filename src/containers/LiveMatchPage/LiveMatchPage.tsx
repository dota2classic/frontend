import React from "react";

import c from "./LiveMatchPage.module.scss";
import { AppRouter } from "@/route";
import { spectateUrl } from "@/util/urls";
import { DotaGameRulesState, LiveMatchDto } from "@/api/back";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { PageLink } from "@/components/PageLink";
import { SmallLiveMatch } from "@/components/LiveMatchPreview";
import { Duration } from "@/components/Duration";
import { Surface } from "@/components/Surface";
import { Badge, BadgeVariant } from "@/components/Badge";

interface ILiveMatchPageProps {
  games: LiveMatchDto[];
}

const getGameStateToneClass = (state: DotaGameRulesState): string => {
  switch (state) {
    case DotaGameRulesState.GAME_IN_PROGRESS:
      return c.stateLive;
    case DotaGameRulesState.PRE_GAME:
    case DotaGameRulesState.HERO_SELECTION:
    case DotaGameRulesState.STRATEGY_TIME:
      return c.stateSetup;
    case DotaGameRulesState.POST_GAME:
    case DotaGameRulesState.DISCONNECT:
      return c.stateEnded;
    default:
      return c.stateMuted;
  }
};

const getGameStateBadgeVariant = (state: DotaGameRulesState): BadgeVariant => {
  switch (state) {
    case DotaGameRulesState.GAME_IN_PROGRESS:
      return "green";
    case DotaGameRulesState.PRE_GAME:
    case DotaGameRulesState.HERO_SELECTION:
    case DotaGameRulesState.STRATEGY_TIME:
      return "blue";
    case DotaGameRulesState.POST_GAME:
    case DotaGameRulesState.DISCONNECT:
      return "red";
    default:
      return "grey";
  }
};

export const LiveMatchPage: React.FC<ILiveMatchPageProps> = observer(
  ({ games }) => {
    const { t } = useTranslation();
    const { liveMatches } = useStore().live;
    const data = (liveMatches.length ? liveMatches : games)
      .slice()
      .sort(
        (a, b) =>
          getLobbyTypePriority(a.matchmakingMode) -
          getLobbyTypePriority(b.matchmakingMode),
      );

    return (
      <>
        <br />
        {data.length === 0 && (
          <div className={c.queue}>
            <span>{t("live_match_page.noGames")}</span>
            <PageLink link={AppRouter.queue.link}>
              {" "}
              {t("live_match_page.launchSearch")}
            </PageLink>
          </div>
        )}
        <div className={c.liveMatches}>
          {data.map((liveMatch) => {
            const rScore = liveMatch.heroes
              .filter((t) => t.team === 2)
              .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
            const dScore = liveMatch.heroes
              .filter((t) => t.team === 3)
              .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
            const matchLink = AppRouter.matches.match(liveMatch.matchId).link;

            return (
              <Surface
                key={liveMatch.matchId}
                className={c.preview}
                padding="md"
                variant="raised"
                interactive
              >
                <PageLink link={matchLink} className={c.minimapLink}>
                  <SmallLiveMatch match={liveMatch} />
                </PageLink>
                <div className={c.matchInfo}>
                  <div className={c.headerRow}>
                    <div className={c.headerCopy}>
                      <div className={c.headerMeta}>
                        <Badge
                          variant={getGameStateBadgeVariant(
                            liveMatch.gameState,
                          )}
                          className={`${c.stateLabel} ${getGameStateToneClass(
                            liveMatch.gameState,
                          )}`}
                        >
                          {t(`game_state.${liveMatch.gameState}`)}
                        </Badge>
                        <Badge variant="grey" className={c.matchCodeBadge}>
                          {t("live_match_page.matchId", {
                            matchId: liveMatch.matchId,
                          })}
                        </Badge>
                      </div>
                      <div className={c.metricsRow}>
                      <div className={c.metricsInline}>
                        <div className={c.metricInline}>
                          <span className={c.statLabel}>
                            {t("live_match_page.score")}
                          </span>
                          <span className={c.scoreValue}>
                            <span className={c.radiantScore}>{rScore}</span>
                            <span className={c.scoreDivider}>:</span>
                            <span className={c.direScore}>{dScore}</span>
                          </span>
                        </div>
                        <span aria-hidden className={c.metricsDivider} />
                        <div className={c.metricInline}>
                          <span className={c.statLabel}>
                            {t("live_match_page.duration")}
                          </span>
                          <span className={c.statValue}>
                            <Duration clock duration={liveMatch.duration} />
                          </span>
                        </div>
                      </div>
                      <div className={c.modeBlock}>
                        <span className={c.modeLabel}>
                          {t("live_match_page.mode")}
                        </span>
                        <span className={c.modeValue}>
                          {t(`matchmaking_mode.${liveMatch.matchmakingMode}`)}
                          <span className={c.modeSeparator}>•</span>
                          <span className={c.modeSubvalue}>
                            {t(`game_mode.${liveMatch.gameMode}`)}
                          </span>
                        </span>
                      </div>
                      </div>
                    </div>
                    <div className={c.actions}>
                      <Button
                        link
                        href={spectateUrl(liveMatch.matchId)}
                        target="_blank"
                        variant="ghost"
                        small
                        className={c.watchButton}
                      >
                        {t("live_match.watchWithLauncher")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>{" "}
      </>
    );
  },
);
