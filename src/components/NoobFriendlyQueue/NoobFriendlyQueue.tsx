import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from "react";

import c from "./NoobFriendlyQueue.module.scss";
import { AppRouter } from "@/route";
import { FaCheck } from "react-icons/fa6";
import cx from "clsx";
import { useStore } from "@/store";
import { FaSteam } from "react-icons/fa";
import { getAuthUrl } from "@/util/getAuthUrl";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { PageLink } from "../PageLink";

interface RequiredStepProps {
  onComplete: () => void;
  action: ReactNode;
  step: number;
  currentStep: number;
}

const RequiredStep: React.FC<PropsWithChildren<RequiredStepProps>> = (p) => {
  const isUpcoming = p.currentStep != p.step;
  const isComplete = p.step > p.currentStep;
  return (
    <div className={cx(c.requiredStep, isUpcoming && c.requiredStep__upcoming)}>
      {p.children}
      <Button
        disabled={isComplete || isUpcoming}
        className={cx(c.button, isComplete && c.complete)}
        onClick={!isComplete ? p.onComplete : () => undefined}
      >
        {isComplete ? <FaCheck /> : ""}
        {p.action}
      </Button>
    </div>
  );
};

export const NoobFriendlyQueue = () => {
  const { auth } = useStore();
  const [completeStep, setCompleteStep] = useState(auth.parsedToken ? 1 : 0);

  const markStepComplete = useCallback(
    () => setCompleteStep((t) => t + 1),
    [setCompleteStep],
  );
  const { t } = useTranslation();
  return (
    <div className={c.noobQueue}>
      <h1>{t("noob_friendly_queue.howToStartPlaying")}</h1>

      <RequiredStep
        onComplete={markStepComplete}
        currentStep={completeStep}
        action={
          <a
            href={getAuthUrl()}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaSteam style={{ marginRight: 4 }} />
            {t("noob_friendly_queue.login")}
          </a>
        }
        step={0}
      >
        <h2>1) {t("noob_friendly_queue.needToAuthorize")}</h2>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        currentStep={completeStep}
        action={t("noob_friendly_queue.downloadAndExtractClient")}
        step={1}
      >
        <h2>2) {t("noob_friendly_queue.downloadAndExtractGameClient")}</h2>
        <PageLink link={AppRouter.download.link}>
          {t("noob_friendly_queue.downloadHere")}
        </PageLink>
        <h3>{t("noob_friendly_queue.possibleDifficulties")}</h3>
        <ul>
          <li>{t("noob_friendly_queue.unpackedArchiveIssue")}</li>
          <li>{t("noob_friendly_queue.downloadIssues")}</li>
        </ul>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        step={2}
        currentStep={completeStep}
        action={t("noob_friendly_queue.gameStartsOnMyComputer")}
      >
        <h2>3) {t("noob_friendly_queue.startTheGame")}</h2>
        <h3>{t("noob_friendly_queue.attentionSteamRequired")}</h3>
        <h3>{t("noob_friendly_queue.possibleDifficulties")}</h3>
        <ul>
          <li>{t("noob_friendly_queue.startedGameWithoutSteam")}</li>
          <li>{t("noob_friendly_queue.notLaunchingGame")}</li>
        </ul>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        currentStep={completeStep}
        step={3}
        action={t("noob_friendly_queue.playedWithBotsReadyToPlayWithPeople")}
      >
        <h2>4) {t("noob_friendly_queue.startSinglePlayerGameWithBots")}</h2>
        <h3>{t("noob_friendly_queue.advicePlayWithBots")}</h3>
        <h3>{t("noob_friendly_queue.possibleDifficulties")}</h3>
        <ul>
          <li>{t("noob_friendly_queue.lags")}</li>
          <li>{t("noob_friendly_queue.dontWantToSeeCharacter")}</li>
          <li>{t("noob_friendly_queue.quickcast")}</li>
          <li>{t("noob_friendly_queue.altClickSelf")}</li>
        </ul>
        <br />
      </RequiredStep>
    </div>
  );
};
