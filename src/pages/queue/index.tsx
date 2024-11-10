import c from "./Queue.module.scss";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import {
  MatchmakingInfo,
  MatchmakingMode,
  PlayerSummaryDto,
  ThreadType,
} from "@/api/back";
import { useDidMount } from "@/util/hooks";
import {
  MatchmakingOption,
  Panel,
  QueuePartyInfo,
  SearchGameButton,
  Section,
  Thread,
} from "@/components";
import Head from "next/head";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import React, { ReactNode } from "react";
import { NextPageContext } from "next";
import { ThreadStyle } from "@/components/Thread/types";

interface Props {
  modes: MatchmakingInfo[];
  playerSummary: PlayerSummaryDto;
}

export default function QueuePage(props: Props) {
  const mounted = useDidMount();

  const { queue } = useStore();

  const { data: modes } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  const playedAnyGame = !!props.playerSummary.playedAnyGame;

  const d84 = modes!
    .filter((it) => it.version === "Dota_684" && it.enabled)
    // .filter(
    //   (it) =>
    //     playedAnyGame ||
    //     it.mode === MatchmakingMode.SOLOMID || // solomid
    //     it.mode === MatchmakingMode.BOTS, // bots
    // )
    .sort((a, b) => Number(a.mode) - Number(b.mode));

  const modEnableCondition = (mode: MatchmakingMode): ReactNode | undefined => {
    // if (mode === MatchmakingMode.UNRANKED && !playedAnyGame) {
    if (mode === MatchmakingMode.UNRANKED) {
      return (
        <>
          Нужно сыграть хотя бы 1 игру в <span className="gold">обучение</span>{" "}
          или <span className="gold">1х1</span>
        </>
      );
    }
  };

  return (
    <div className={c.queue}>
      <Head>
        <title>Dota2Classic - поиск игры</title>
      </Head>
      <Section className={c.modes}>
        <header>Режим игры</header>
        <Panel className={c.modes__list}>
          {d84.map((info) => (
            <MatchmakingOption
              disabled={modEnableCondition(info.mode)}
              key={`${info.mode}${info.version}`}
              onSelect={queue.setSelectedMode}
              version={info.version}
              mode={info.mode}
            />
          ))}
          <div style={{ flex: 1 }} />
          <SearchGameButton visible={true} />
        </Panel>
      </Section>
      <Section className={c.main}>
        <header>Группа и поиск</header>
        <QueuePartyInfo />
        <Thread
          scrollToLast
          className={c.queueDiscussion}
          showLastMessages={30}
          threadStyle={ThreadStyle.TINY}
          id={"17aa3530-d152-462e-a032-909ae69019ed"}
          threadType={ThreadType.FORUM}
        />
      </Section>
    </div>
  );
}

const redirectToDownload = async (ctx: NextPageContext) => {
  if (ctx.res) {
    // On the server, we'll use an HTTP response to
    // redirect with the status code of our choice.
    // 307 is for temporary redirects.
    ctx.res.writeHead(307, { Location: "/download" });
    ctx.res.end();
  } else {
    window.location = "/download" as never;
    // While the page is loading, code execution will
    // continue, so we'll await a never-resolving
    // promise to make sure our page never
    // gets rendered.
    await new Promise(() => {});
  }
};

QueuePage.getInitialProps = async (ctx: NextPageContext) => {
  // We need to check if we are logged in
  const jwt = withTemporaryToken(ctx, (store) => store.auth.parsedToken);
  if (!jwt) {
    // not logged in
    await redirectToDownload(ctx);
    return;
  }

  const [modes, playerSummary] = await Promise.combine([
    getApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(ctx, (stores) => {
      return getApi().playerApi.playerControllerPlayerSummary(
        stores.auth.parsedToken!.sub,
      );
    }),
  ]);

  return {
    modes,
    playerSummary,
  };
};
