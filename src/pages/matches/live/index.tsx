import Head from "next/head";
import { getApi } from "@/api/hooks";
import c from "./LiveMatches.module.scss";
import { Duration, PageLink, SmallLiveMatch } from "@/components";
import { AppRouter } from "@/route";
import { LiveMatchDto } from "@/api/back";
import { formatGameMode } from "@/util/gamemode";
import React from "react";
import { useDidMount } from "@/util/hooks";
import { watchUrl } from "@/util/urls";
import cx from "clsx";

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
          .reduce((a, b) => a + b.kills, 0);
        const dScore = t.heroes
          .filter((t) => t.team === 3)
          .reduce((a, b) => a + b.kills, 0);
        return (
          <div key={t.matchId} className={c.preview}>
            <PageLink link={AppRouter.matches.match(t.matchId).link}>
              <SmallLiveMatch match={t} />
            </PageLink>
            <div className={c.matchInfo}>
              <h3>
                <PageLink
                  link={AppRouter.matches.match(t.matchId).link}
                  className="link"
                >
                  Матч {t.matchId}
                </PageLink>
              </h3>
              <div className={c.info}>
                Режим: {formatGameMode(t.matchmakingMode)}
              </div>
              <div className={c.info}>
                Счет: {rScore}:{dScore}
              </div>
              <div className={c.info}>
                Время: <Duration duration={t.duration} />
              </div>
              <a
                target={"__blank"}
                href={watchUrl(t.server)}
                className={cx(c.info, "link")}
              >
                Смотреть в игре
              </a>
            </div>
          </div>
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
