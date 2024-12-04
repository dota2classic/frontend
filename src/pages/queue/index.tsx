import c from "./Queue.module.scss";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import {
  MatchmakingInfo,
  MatchmakingMode,
  PartyDto,
  PartyMemberDTO,
  ThreadType,
} from "@/api/back";
import { useDidMount } from "@/util/hooks";
import {
  Button,
  EmbedProps,
  GameReadyModal,
  MatchmakingOption,
  Panel,
  PeriodicSpan,
  QueuePartyInfo,
  SearchGameButton,
  Section,
  Thread,
  TimeAgo,
} from "@/components";
import Head from "next/head";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import React, { ReactNode, useTransition } from "react";
import { NextPageContext } from "next";
import { ThreadStyle } from "@/components/Thread/types";
import { FaBell } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { QueueGameState, useQueueState } from "@/util/useQueueState";
import { WaitingAccept } from "@/components/AcceptGameModal/WaitingAccept";
import { ServerSearching } from "@/components/AcceptGameModal/ServerSearching";
import { QueueStore } from "@/store/queue/QueueStore";
import formatDuration from "format-duration";

interface Props {
  modes: MatchmakingInfo[];
  "@party"?: PartyDto;
}

const NotificationSetting = observer(() => {
  const { notify } = useStore();

  const [isPending, startTransition] = useTransition();

  if (!notify.isPushSupported) return null;

  if (!notify.registration) return;

  if (!notify.subscription) {
    return (
      <Button
        className={c.notify}
        onClick={() => startTransition(notify.subscribeToPush)}
      >
        <span style={{ flex: 1 }}>Включить уведомления</span>
        {isPending ? (
          <AiOutlineLoading3Quarters className="loading" />
        ) : (
          <FaBell style={{ float: "right" }} />
        )}
      </Button>
    );
  }

  return (
    <Button
      className={c.notify}
      onClick={() => startTransition(notify.unsubscribe)}
    >
      <span style={{ flex: 1 }}>Отключить уведомления</span>
      <FaBell style={{ float: "right" }} />
    </Button>
  );
});

const ModeList = observer(({ modes }: Omit<Props, "@party">) => {
  const { queue, auth } = useStore();

  const me: PartyMemberDTO | undefined = (queue.party?.players || []).find(
    (plr: PartyMemberDTO) => plr.summary.id === auth.parsedToken?.sub,
  );

  const isCalibration = !!me?.summary?.calibrationGamesLeft;

  const d84 = modes!
    .filter((it) => it.version === "Dota_684" && it.enabled)
    .sort((a, b) => Number(a.mode) - Number(b.mode));

  const modEnableCondition = (mode: MatchmakingMode): ReactNode | undefined => {
    if (mode !== MatchmakingMode.BOTS && queue.partyBanStatus?.isBanned) {
      return (
        <>
          Поиск запрещен до <TimeAgo date={queue.partyBanStatus!.bannedUntil} />
        </>
      );
    }
    if (mode === MatchmakingMode.UNRANKED && queue.isNewbieParty) {
      return (
        <>
          Нужно пройти <span className="gold">обучение</span>{" "}
        </>
      );
    }
    if (mode === MatchmakingMode.UNRANKED && !queue.isUnrankedQueueOpen) {
      return (
        <>
          <PeriodicSpan
            interval={1000}
            producer={() => {
              const d = new Date();

              const myd = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                18,
                0,
                0,
              );

              const myd2 = new Date(
                myd.getTime() +
                  (QueueStore.UTC_OFFSET - myd.getTimezoneOffset()) * 60 * 1000,
              );

              let timeDiff = myd2.getTime() - d.getTime();
              if (timeDiff < 0) {
                timeDiff += 1000 * 60 * 60 * 24; // Next day
              } else if (timeDiff > 1000 * 60 * 60 * 24) {
                timeDiff -= 1000 * 60 * 60 * 24; // Prev day
              }

              return formatDuration(timeDiff);
            }}
          />{" "}
          до поиска
        </>
      );
    }
  };

  const queueGameState = useQueueState();

  return (
    <Section className={c.modes}>
      <header>Режим игры</header>
      <Panel className={c.modes__list}>
        {d84.map((info) => (
          <MatchmakingOption
            selected={queue.queueState?.mode === info.mode}
            localSelected={queue.selectedMode?.mode === info.mode}
            disabled={modEnableCondition(info.mode)}
            key={`${info.mode}${info.version}`}
            onSelect={queue.setSelectedMode}
            version={info.version}
            mode={info.mode}
            suffix={
              isCalibration && info.mode === MatchmakingMode.UNRANKED ? (
                <>
                  еще{" "}
                  <span className="gold">
                    {me?.summary?.calibrationGamesLeft}
                  </span>{" "}
                  калибровочных игр
                </>
              ) : undefined
            }
          />
        ))}
        <NotificationSetting />
        <div style={{ flex: 1 }} />
        {queueGameState === QueueGameState.NO_GAME && (
          <SearchGameButton visible={true} />
        )}
        {queueGameState === QueueGameState.SERVER_READY && (
          <GameReadyModal className={c.gameReady} />
        )}
        {queueGameState === QueueGameState.READY_CHECK_WAITING_OTHER && (
          <WaitingAccept className={c.gameReady} />
        )}
        {queueGameState === QueueGameState.SEARCHING_SERVER && (
          <ServerSearching className={c.gameReady} />
        )}
      </Panel>
    </Section>
  );
});

export default function QueuePage(props: Props) {
  const mounted = useDidMount();

  const { data: modes } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  return (
    <div className={c.queue}>
      <Head>
        <title>Dota2Classic - поиск игры</title>
      </Head>
      <EmbedProps
        title="Поиск игры"
        description="Страница поиска игры в старую доту. Играй в группе со своими друзьями с ботами и другими людьми"
      />
      <ModeList modes={modes || props.modes} />
      <Section className={c.main}>
        <header>Группа и поиск</header>
        <QueuePartyInfo />
        <Thread
          scrollToLast
          className={c.queueDiscussion}
          showLastMessages={100}
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

QueuePage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  // We need to check if we are logged in
  const jwt = withTemporaryToken(ctx, (store) => store.auth.parsedToken);
  if (!jwt) {
    // not logged in
    await redirectToDownload(ctx);
    return { modes: [] };
  }

  const [modes, party] = await Promise.combine([
    getApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(ctx, () => {
      return getApi().playerApi.playerControllerMyParty();
    }),
  ]);

  return {
    modes,
    "@party": party,
  };
};
