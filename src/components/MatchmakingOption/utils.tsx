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
  if (queue.partyBanStatus?.isBanned) {
    return (
      <>
        {t("matchmaking_option.searchForbiddenUntil", {
          date: <TimeAgo date={queue.partyBanStatus!.bannedUntil} />,
        })}
      </>
    );
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
