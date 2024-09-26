import c from "./Queue.module.scss";
import { useStore } from "@/store";
import { useApi } from "@/api/hooks";
import {
  MatchmakingInfo,
  MatchmakingInfoModeEnum,
  PlayerSummaryDto,
} from "@/api/back";
import { useDidMount } from "@/util/hooks";
import { MatchmakingOption, QueuePartyInfo } from "@/components";
import { NextPageContext } from "next";
import Head from "next/head";
import Cookies from "cookies";
import { AuthStore } from "@/store/AuthStore";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import * as BrowserCookies from "browser-cookies";

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
        it.mode === MatchmakingInfoModeEnum.NUMBER_2 || // solomid
        it.mode === MatchmakingInfoModeEnum.NUMBER_7, // bots
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
  // If we are on client, we need to use browser cookies
  let cookies: { get: (key: string) => string | undefined | null };
  if (typeof window === "undefined") {
    // @ts-ignore
    cookies = new Cookies(ctx.req, ctx.res);
  } else {
    cookies = BrowserCookies;
  }
  const token = cookies.get(AuthStore.cookieTokenKey) || undefined;

  const [modes, playerSummary] = await Promise.all<any>([
    useApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(token, (stores) => {
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
