import Head from "next/head";
import { getApi } from "@/api/hooks";
import c from "./LiveMatches.module.scss";
import { Duration, PageLink, Panel, SmallLiveMatch } from "@/components";
import { AppRouter } from "@/route";
import { LiveMatchDto } from "@/api/back";
import {
  formatDotaMode,
  formatGameMode,
  formatGameState,
} from "@/util/gamemode";
import React from "react";
import { useDidMount } from "@/util/hooks";
import { watchCmd } from "@/util/urls";
import { CopySomething } from "@/components/AcceptGameModal/GameReadyModal";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data: initialData }: InitialProps) {
  const mounted = useDidMount();
  const { data } = getApi().liveApi.useLiveMatchControllerListMatches({
    refreshInterval: 3000,
    fallbackData: initialData,
    isPaused() {
      return !mounted;
    },
  });

  return (
    <>
      <Head>
        <title>Текущие матчи - dota2classic.ru</title>
      </Head>

      {data!.length === 0 && (
        <div className={c.queue}>
          <span>Сейчас не идет ни одной игры.</span>
          <PageLink link={AppRouter.queue.link}>
            Отличный повод запустить поиск!
          </PageLink>
        </div>
      )}

      {data!.map((t) => {
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
                <CopySomething something={watchCmd(t.server)} />
              </div>
            </div>
          </Panel>
        );
      })}
    </>
  );
}

LiveMatches.getInitialProps = async (): Promise<InitialProps> => {
  const data = await getApi().liveApi.liveMatchControllerListMatches();

  return {
    data,
  };
};
