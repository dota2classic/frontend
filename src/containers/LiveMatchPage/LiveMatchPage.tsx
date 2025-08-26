import React from "react";

import c from "./LiveMatchPage.module.scss";
import {
  CopySomething,
  Duration,
  Input,
  PageLink,
  Panel,
  SmallLiveMatch,
} from "@/components";
import { AppRouter } from "@/route";
import {
  formatDotaMode,
  formatGameMode,
  formatGameState,
} from "@/util/gamemode";
import { watchCmd } from "@/util/urls";
import { observer } from "mobx-react-lite";
import { LiveMatchDto } from "@/api/back";
import { useStore } from "@/store";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { useTranslation } from "react-i18next";

interface ILiveMatchPageProps {
  games: LiveMatchDto[];
}

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
        {data.length === 0 && (
          <div className={c.queue}>
            <span>{t("live_match_page.noGames")}</span>
            <PageLink link={AppRouter.queue.link}>
              {" "}
              {t("live_match_page.launchSearch")}
            </PageLink>
          </div>
        )}
        {data.map((liveMatch) => {
          const rScore = liveMatch.heroes
            .filter((t) => t.team === 2)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
          const dScore = liveMatch.heroes
            .filter((t) => t.team === 3)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
          return (
            <Panel key={liveMatch.matchId} className={c.preview}>
              <PageLink link={AppRouter.matches.match(liveMatch.matchId).link}>
                <SmallLiveMatch match={liveMatch} />
              </PageLink>
              <div className={c.matchInfo}>
                <h3>
                  <PageLink
                    link={AppRouter.matches.match(liveMatch.matchId).link}
                    className="link"
                  >
                    Матч {liveMatch.matchId} -{" "}
                    {formatGameState(liveMatch.gameState)}
                  </PageLink>
                </h3>
                <h3>
                  <PageLink
                    link={AppRouter.matches.match(liveMatch.matchId).link}
                    className="link"
                  >
                    Матч {liveMatch.matchId} -{" "}
                    {formatGameState(liveMatch.gameState)}
                  </PageLink>
                </h3>
                <div className={c.info}>
                  Режим: {formatGameMode(liveMatch.matchmakingMode)},{" "}
                  {formatDotaMode(liveMatch.gameMode)}
                </div>
                <div className={c.info}>
                  Счет: <span className="green">{rScore}</span> :{" "}
                  <span className="red">{dScore}</span>
                </div>
                <div className={c.info}>
                  Время: <Duration duration={liveMatch.duration} />
                </div>
                <div className={c.info}>
                  <CopySomething
                    something={watchCmd(liveMatch.server)}
                    placeholder={
                      <Input
                        value={watchCmd(liveMatch.server)}
                        readOnly={true}
                      />
                    }
                  />
                </div>
              </div>
            </Panel>
          );
        })}
      </>
    );
  },
);
