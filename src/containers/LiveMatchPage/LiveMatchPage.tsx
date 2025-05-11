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

interface ILiveMatchPageProps {
  games: LiveMatchDto[];
}

export const LiveMatchPage: React.FC<ILiveMatchPageProps> = observer(
  ({ games }) => {
    const { liveMatches } = useStore().live;
    const data = liveMatches.length ? liveMatches : games;

    return (
      <>
        {data.length === 0 && (
          <div className={c.queue}>
            <span>Сейчас не идет ни одной игры.</span>
            <PageLink link={AppRouter.queue.link}>
              Отличный повод запустить поиск!
            </PageLink>
          </div>
        )}
        {data.map((t) => {
          const rScore = t.heroes
            .filter((t) => t.team === 2)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
          const dScore = t.heroes
            .filter((t) => t.team === 3)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0);
          return (
            <Panel key={t.matchId} className={c.preview}>
              <PageLink link={AppRouter.matches.match(t.matchId).link}>
                <SmallLiveMatch match={t} />
              </PageLink>
              <div className={c.matchInfo}>
                <h3>
                  <PageLink
                    link={AppRouter.matches.match(t.matchId).link}
                    className="link"
                  >
                    Матч {t.matchId} - {formatGameState(t.gameState)}
                  </PageLink>
                </h3>
                <div className={c.info}>
                  Режим: {formatGameMode(t.matchmakingMode)},{" "}
                  {formatDotaMode(t.gameMode)}
                </div>
                <div className={c.info}>
                  Счет: <span className="green">{rScore}</span> :{" "}
                  <span className="red">{dScore}</span>
                </div>
                <div className={c.info}>
                  Время: <Duration duration={t.duration} />
                </div>
                <div className={c.info}>
                  <CopySomething
                    something={watchCmd(t.server)}
                    placeholder={
                      <Input value={watchCmd(t.server)} readOnly={true} />
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
