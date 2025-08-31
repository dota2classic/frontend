import { MatchmakingMode } from "@/api/mapped-models";
import React from "react";
import { TimeAgo } from "@/components";
import {
  GameModeAccessLevel,
  getRequiredAccessLevel,
} from "@/const/game-mode-access-level";
import { QueueStore } from "@/store/queue/QueueStore";
import { Trans, TranslationFunction } from "react-i18next";

export const modEnableCondition = (
  queue: QueueStore,
  mode: MatchmakingMode,
  t: TranslationFunction,
): React.ReactNode | undefined => {
  if (queue.partyBanStatus?.isBanned && mode === MatchmakingMode.UNRANKED) {
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
    const gamesRequired = 30;
    if (queue.minGamesInParty < gamesRequired) {
      return (
        <>
          {t("matchmaking_option.needToPlayMore", {
            gamesRequired: gamesRequired - queue.minGamesInParty,
          })}
        </>
      );
    }
  }
};
