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
  Section,
  Thread,
} from "@/components";
import Head from "next/head";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import React from "react";
import { NextPageContext } from "next";
import { ThreadStyle } from "@/components/Thread/Thread";

interface Props {
  modes: MatchmakingInfo[];
  playerSummary?: PlayerSummaryDto;
}

export default function QueuePage(props: Props) {
  const mounted = useDidMount();

  const { queue } = useStore();

  const { data: onlineData } = getApi().statsApi.useStatsControllerOnline();

  const { data: modes } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  const playedAnyGame = !!props.playerSummary?.playedAnyGame;

  const queueStore = useStore().queue;

  const d84 = modes!
    .filter((it) => it.version === "Dota_684" && it.enabled)
    .filter(
      (it) =>
        playedAnyGame ||
        it.mode === MatchmakingMode.SOLOMID || // solomid
        it.mode === MatchmakingMode.BOTS, // bots
    )
    .sort((a, b) => Number(a.mode) - Number(b.mode));

  return (
    <div className={c.queue}>
      <Head>
        <title>Dota2Classic - поиск игры</title>
      </Head>
      <Section className={c.modes}>
        <header>Режим игры</header>
        <Panel className={c.modes}>
          {d84.map((info) => (
            <MatchmakingOption
              key={`${info.mode}${info.version}`}
              onSelect={queueStore.setSelectedMode}
              version={info.version}
              mode={info.mode}
            />
          ))}
          <div style={{ flex: 1 }} />
          {onlineData && (
            <div className={c.onlineInfo}>
              <span>{onlineData.inGame} в игре</span>
              <span>{queue.online} онлайн</span>
              <span>
                Свободных серверов: {onlineData.servers - onlineData.sessions}
              </span>
              <span>Игр идет: {onlineData.sessions}</span>
            </div>
          )}
        </Panel>
      </Section>
      <Section className={c.main}>
        <header>Группа и поиск</header>
        <QueuePartyInfo />
        <Thread
          className={c.queueDiscussion}
          showLastMessages={10}
          threadStyle={ThreadStyle.TINY}
          id={"17aa3530-d152-462e-a032-909ae69019ed"}
          threadType={ThreadType.FORUM}
        />
      </Section>
    </div>
  );
}

QueuePage.getInitialProps = async (ctx: NextPageContext) => {
  const [modes, playerSummary] = await Promise.all<unknown>([
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
