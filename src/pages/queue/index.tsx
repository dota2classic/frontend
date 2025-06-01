import c from "./Queue.module.scss";
import { getApi } from "@/api/hooks";
import {
  MatchmakingInfo,
  MatchmakingMode,
  PartyDto,
  ThreadType,
} from "@/api/back";
import { useDidMount } from "@/util";
import {
  EmbedProps,
  MatchmakingModeList,
  OnboardingTooltip,
  QueuePartyInfo,
  Section,
} from "@/components";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import React from "react";
import { NextPageContext } from "next";
import { Thread } from "@/containers";
import Cookies from "cookies";
import { QueueStore } from "@/store/queue/QueueStore";
import BrowserCookies from "browser-cookies";

import dynamic from "next/dynamic";
import { STATUS } from "react-joyride";
import { useLocalStorage } from "react-use";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

interface Props {
  modes: MatchmakingInfo[];

  "@party"?: PartyDto;
  "@defaultModes": MatchmakingMode[];
}

export default function QueuePage(props: Props) {
  const mounted = useDidMount();
  const [tutorialComplete, setTutorialComplete] = useLocalStorage(
    "tutorial-passed",
    false,
  );

  const { data: modes } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  return (
    <>
      <JoyRideNoSSR
        disableScrolling
        // disableScrollParentFix
        callback={({ status }) => {
          console.log(status);
          if (([STATUS.FINISHED] as string[]).includes(status)) {
            setTutorialComplete(true);
          }
        }}
        run={!tutorialComplete}
        steps={[
          {
            title: "Режимы игры",
            disableBeacon: true,
            target: ".onboarding-mode-list",
            content:
              "Тут список режимов, доступных для поиска игры. Можно выбрать несколько режимов сразу! Чтобы искать игру 5х5, тебе нужно победить в обучении против ботов.",
          },
          {
            target: ".onboarding-party",
            title: "Группа",
            content: 'Тут твоя группа: чтобы пригласить друга, нажми на "+"',
          },
          {
            target: ".onboarding-online-stats",
            placement: "left",
            content:
              "Тут можно посмотреть, сколько сейчас играет и сколько просто находится на сайте",
          },
          {
            placement: "left",
            target: ".onboarding-chat-window",
            title: "Общий чат",
            content:
              "Общий чат для всех игроков - тут ты можешь рассказать, если возникли проблемы, и тебе помогут.",
          },
          {
            placement: "top",
            title: "Кнопка поиска",
            target: ".onboarding-queue-button",
            content:
              "Когда выберешь режим для поиска, нажимай на эту кнопку - начнется поиск игры.",
          },
          {
            title: "Адблок",
            target: ".onboarding-logo",
            content:
              "Пожалуйста, отключи блокировку рекламы на этом сайте. Хоть игра здесь абсолютно бесплатна, содержание проекта все равно стоит денег. Приятной игры!",
          },
        ]}
        tooltipComponent={OnboardingTooltip}
        debug
        // showProgress
        showSkipButton
        continuous
        locale={{
          back: "Назад",
          close: "Закрыть",
          last: "Конец",
          next: "Дальше",
          nextLabelWithProgress: "Дальше (Шаг {step} из {steps})",
          open: "Открыть диалог",
          skip: "Пропустить",
        }}
        styles={{
          options: {
            zIndex: 1000000000,
          },
        }}
      />
      <div className={c.queue}>
        <EmbedProps
          title="Поиск игры"
          description="Страница поиска игры в старую доту. Играй в группе со своими друзьями с ботами и другими людьми"
        />
        <MatchmakingModeList modes={modes || props.modes} />
        <Section className={c.main}>
          <header>Группа и поиск</header>
          <QueuePartyInfo />
          <Thread
            className={c.queueDiscussion}
            id={"17aa3530-d152-462e-a032-909ae69019ed"}
            threadType={ThreadType.FORUM}
          />
        </Section>
      </div>
    </>
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
    return { modes: [], "@defaultModes": [] };
  }

  const [modes, party] = await Promise.combine([
    getApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(ctx, () => {
      return getApi().playerApi.playerControllerMyParty();
    }),
  ]);

  let defaultModes: MatchmakingMode[] = [];
  if (typeof window === "undefined") {
    const cookies = new Cookies(ctx.req!, ctx.res!);
    defaultModes = QueueStore.inferDefaultMode(
      (key) => cookies.get(key) || null,
      party,
    );
  } else {
    defaultModes = QueueStore.inferDefaultMode(
      (key) => BrowserCookies.get(key) || null,
      party,
    );
  }

  return {
    modes,
    "@party": party,
    "@defaultModes": defaultModes,
  };
};
