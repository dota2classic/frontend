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
  BigTabs,
  EmbedProps,
  MatchmakingModeList,
  OnboardingTooltip,
  QueuePartyInfo,
  Section,
} from "@/components";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import React, { useState } from "react";
import { NextPageContext } from "next";
import { Thread } from "@/containers";
import Cookies from "cookies";
import { QueueStore } from "@/store/queue/QueueStore";
import BrowserCookies from "browser-cookies";

import dynamic from "next/dynamic";
import { STATUS } from "react-joyride";
import { useLocalStorage } from "react-use";
import cx from "clsx";
import { redirectToPage } from "@/util/redirectToPage";
import { useTranslation } from "react-i18next";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

interface Props {
  modes: MatchmakingInfo[];

  "@party"?: PartyDto;
  "@defaultModes": MatchmakingMode[];
}

type Tabs = "chat" | "modes";

export default function QueuePage(props: Props) {
  const { t } = useTranslation();
  const mounted = useDidMount();
  const [tutorialComplete, setTutorialComplete] = useLocalStorage(
    "tutorial-passed",
    false,
  );

  const [tab, setTab] = useState<Tabs>("modes");

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
        callback={({ status }) => {
          console.log(status);
          if (([STATUS.FINISHED] as string[]).includes(status)) {
            setTutorialComplete(true);
          }
        }}
        run={!tutorialComplete}
        steps={[
          {
            title: t("queue_page.onboarding.gameModes.title"),
            disableBeacon: true,
            target: ".onboarding-mode-list",
            content: t("queue_page.onboarding.gameModes.content"),
          },
          {
            target: ".onboarding-party",
            title: t("queue_page.onboarding.party.title"),
            content: t("queue_page.onboarding.party.content"),
          },
          {
            target: ".onboarding-online-stats",
            placement: "left",
            content: t("queue_page.onboarding.onlineStats.content"),
          },
          {
            placement: "left",
            target: ".onboarding-chat-window",
            title: t("queue_page.onboarding.chat.title"),
            content: t("queue_page.onboarding.chat.content"),
          },
          {
            placement: "top",
            title: t("queue_page.onboarding.searchButton.title"),
            target: ".onboarding-queue-button",
            content: t("queue_page.onboarding.searchButton.content"),
          },
          {
            title: t("queue_page.onboarding.adblock.title"),
            target: ".onboarding-logo",
            content: t("queue_page.onboarding.adblock.content"),
          },
        ]}
        tooltipComponent={OnboardingTooltip}
        debug
        showSkipButton
        continuous
        locale={{
          back: t("queue_page.onboarding.locale.back"),
          close: t("queue_page.onboarding.locale.close"),
          last: t("queue_page.onboarding.locale.last"),
          next: t("queue_page.onboarding.locale.next"),
          nextLabelWithProgress: t(
            "queue_page.onboarding.locale.nextLabelWithProgress",
            { step: "step", steps: "steps" },
          ),
          open: t("queue_page.onboarding.locale.open"),
          skip: t("queue_page.onboarding.locale.skip"),
        }}
        styles={{
          options: {
            zIndex: 1000000000,
          },
        }}
      />
      <div className={c.queue}>
        <EmbedProps
          title={t("queue_page.seo.title")}
          description={t("queue_page.seo.description")}
        />
        <BigTabs<Tabs>
          className={c.mobile__tabs}
          flavor="small"
          selected={tab}
          items={[
            {
              key: "modes",
              label: t("queue_page.bigTabs.play"),
              onSelect: setTab,
            },
            {
              key: "chat",
              label: t("queue_page.bigTabs.chat"),
              onSelect: setTab,
            },
          ]}
        />
        <MatchmakingModeList
          className={cx(
            c.mobile__modes,
            tab !== "modes" && c.mobile__modes_hidden,
          )}
          modes={modes || props.modes}
        />
        <Section
          className={cx(
            c.main,
            c.mobile__chat,
            tab !== "chat" && c.mobile__modes_hidden,
          )}
        >
          <header>{t("queue_page.section.header")}</header>
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

QueuePage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const jwt = withTemporaryToken(ctx, (store) => store.auth.parsedToken);
  if (!jwt) {
    await redirectToPage(ctx, "/download");
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
