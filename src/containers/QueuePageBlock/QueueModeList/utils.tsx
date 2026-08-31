import { MatchmakingMode } from "@/api/mapped-models";
import React from "react";
import {
  GameModeAccessLevel,
  getRequiredAccessLevel,
} from "@/const/game-mode-access-level";
import { QueueStore } from "@/store/queue/QueueStore";
import { Trans, TranslationFunction } from "react-i18next";
import { TimeAgo } from "@/components/TimeAgo";

// Locked placeholder modes — not wired to real matchmaking yet, always
// show as forbidden regardless of party/ban state.
const LOCKED_PLACEHOLDER_MODES: MatchmakingMode[] = [
  14 as MatchmakingMode,
  15 as MatchmakingMode,
];
const LOCKED_PLACEHOLDER_UNTIL = "2027-01-01T00:00:00Z";

export const modEnableCondition = (
  queue: QueueStore,
  mode: MatchmakingMode,
  t: TranslationFunction,
): React.ReactNode | undefined => {
  if (LOCKED_PLACEHOLDER_MODES.includes(mode)) {
    return (
      <>
        {t("matchmaking_option.searchForbiddenUntil")}{" "}
        <TimeAgo date={LOCKED_PLACEHOLDER_UNTIL} />
      </>
    );
  }

  if (
    queue.partyBanStatus?.isBanned &&
    (mode === MatchmakingMode.UNRANKED || mode === MatchmakingMode.HIGHROOM)
  ) {
    return (
      <>
        {t("matchmaking_option.searchForbiddenUntil")}{" "}
        <TimeAgo date={queue.partyBanStatus!.bannedUntil} />
      </>
    );
  }

  if (
    queue.partyBanStatus?.isBanned &&
    new Date(queue.partyBanStatus!.bannedUntil).getTime() >
      Date.now() + 1000 * 60 * 60 * 24 * 365
  ) {
    return <>{t("matchmaking_option.searchForbiddenPermanent")}</>;
  }

  const requiredAccessLevel = getRequiredAccessLevel(mode);
  const partyAccessLevel = queue.partyAccessLevel;

  if (partyAccessLevel < requiredAccessLevel) {
    if (requiredAccessLevel === GameModeAccessLevel.SIMPLE_MODES) {
      return (
        <>
          <Trans
            i18nKey="matchmaking_option.needToPlayAgainstBots"
            components={{
              attention: <span className="gold" />,
            }}
          />
        </>
      );
    } else if (requiredAccessLevel === GameModeAccessLevel.HUMAN_GAMES) {
      return <> {t("matchmaking_option.needToWinAnyMode")} </>;
    }
  }

  if (mode === MatchmakingMode.HIGHROOM) {
    const mmrRequired = 2500;
    if (queue.minMmrInParty < mmrRequired) {
      return (
        <>
          {t("matchmaking_option.needToPlayMore", {
            minMmr: mmrRequired,
          })}
        </>
      );
    }
  }
};
