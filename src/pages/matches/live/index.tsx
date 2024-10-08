import Head from "next/head";
import { useApi } from "@/api/hooks";
import c from "./LiveMatches.module.scss";
import { PageLink, SmallLiveMatch } from "@/components";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";
import { LiveMatchDto } from "@/api/back";
import { formatGameMode } from "@/util/gamemode";
import { watchUrl } from "@/util/urls";
import React from "react";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data: initialData }: InitialProps) {
  const { data } = useApi().liveApi.useLiveMatchControllerListMatches({
    refreshInterval: 3000,
    fallbackData: initialData,
  });

  return (
    <>
      <Head>
        <title>Текущие матчи - dota2classic.ru</title>
      </Head>

      {data?.length === 0 && (
        <div className={c.queue}>
          <span>Сейчас не идет ни одной игры.</span>
          <PageLink link={AppRouter.queue.link}>
            Отличный повод запустить поиск!
          </PageLink>
        </div>
      )}

      {data?.map((t) => (
        <PageLink
          link={AppRouter.matches.match(t.matchId).link}
          className={c.preview}
        >
          <SmallLiveMatch match={t} />
          <div>
            <h3>
              Матч {t.matchId}, {formatGameMode(t.matchmakingMode)}
            </h3>
            <a target={"__blank"} href={watchUrl(t.server)}>
              Смотреть в игре
            </a>
          </div>
        </PageLink>
      ))}
    </>
  );
}

LiveMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const data = await useApi().liveApi.liveMatchControllerListMatches();

  return {
    data,
  };
};
