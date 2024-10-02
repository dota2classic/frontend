import c from "./Queue.module.scss";
import { useStore } from "@/store";
import { useApi } from "@/api/hooks";
import { MatchmakingInfo, MatchmakingMode, PlayerSummaryDto } from "@/api/back";
import { useDidMount } from "@/util/hooks";
import { MatchmakingOption, QueuePartyInfo } from "@/components";
import { NextPageContext } from "next";
import Head from "next/head";
import { withTemporaryToken } from "@/util/withTemporaryToken";

interface Props {
  modes: MatchmakingInfo[];
  playerSummary?: PlayerSummaryDto;
}

export default function QueuePage(props: Props) {
  const mounted = useDidMount();

  const { data: modes } =
    useApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  // const playedAnyGame = !!props.playerSummary?.playedAnyGame
  const playedAnyGame = false;

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
      <div className={c.modes}>
        {d84.map((info) => (
          <MatchmakingOption
            key={`${info.mode}${info.version}`}
            onSelect={queueStore.setSelectedMode}
            version={info.version as any}
            mode={info.mode as any}
          />
        ))}
      </div>
      <div className={c.main}>
        <QueuePartyInfo />
      </div>
    </div>
  );
}

QueuePage.getInitialProps = async (ctx: NextPageContext) => {
  const [modes, playerSummary] = await Promise.all<any>([
    useApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(ctx, (stores) => {
      return useApi().playerApi.playerControllerPlayerSummary(
        stores.auth.parsedToken!.sub,
      );
    }),
  ]);

  return {
    modes,
    playerSummary,
  };
};
