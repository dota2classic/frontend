import { STATUS } from "react-joyride";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import dynamic from "next/dynamic";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

export const QueueTutorial = () => {
  const { t } = useTranslation();
  const [tutorialComplete, setTutorialComplete] = useLocalStorage(
    "tutorial-passed-new",
    false,
  );
  return (
    <JoyRideNoSSR
      disableScrolling
      callback={({ status }) => {
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
  );
};
