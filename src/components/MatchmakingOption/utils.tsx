import { MatchmakingMode } from "@/api/mapped-models";
import React, { ReactNode } from "react";
import { TimeAgo } from "@/components";
import {
  GameModeAccessLevel,
  getRequiredAccessLevel,
} from "@/const/game-mode-access-level";
import { QueueStore } from "@/store/queue/QueueStore";

export const modEnableCondition = (
  queue: QueueStore,
  mode: MatchmakingMode,
): ReactNode | undefined => {
  if (queue.partyBanStatus?.isBanned) {
    return (
      <>
        Поиск запрещен до <TimeAgo date={queue.partyBanStatus!.bannedUntil} />
      </>
    );
  }

  const requiredAccessLevel = getRequiredAccessLevel(mode);
  const partyAccessLevel = queue.partyAccessLevel;

  if (partyAccessLevel < requiredAccessLevel) {
    if (requiredAccessLevel === GameModeAccessLevel.SIMPLE_MODES) {
      return (
        <>
          Нужно сыграть <span className="gold">против ботов</span>{" "}
        </>
      );
    } else if (requiredAccessLevel === GameModeAccessLevel.HUMAN_GAMES) {
      return <>Нужно победить в любом режиме</>;
    }
  }
};
