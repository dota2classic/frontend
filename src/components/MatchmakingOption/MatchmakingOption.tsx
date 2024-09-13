import React from "react";

import c from "./MatchmakingOption.module.scss";
import { MatchmakingMode } from "@/const/enums";
import { Dota2Version, formatGameMode } from "@/util/gamemode";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "classnames";

interface MatchmakingOptionProps {
  mode: MatchmakingMode;
  version: Dota2Version;
  unrankedGamesLeft?: number;
  onSelect: (mode: MatchmakingMode, version: Dota2Version) => void;
}

export const MatchmakingOption = observer(
  ({ mode, version, unrankedGamesLeft, onSelect }: MatchmakingOptionProps) => {
    const { queue } = useStore();

    const lockedCuzNewbie =
      unrankedGamesLeft !== undefined &&
      unrankedGamesLeft > 0 &&
      mode !== MatchmakingMode.BOTS;

    const localSelected =
      queue.selectedMode?.mode === mode &&
      queue.selectedMode?.version === version;

    const isSelected =
      queue.searchingMode?.mode === mode &&
      queue.searchingMode?.version === version;

    console.log("Re-rener option", mode, queue.inQueueCount(mode, version));
    return (
      <div
        className={cx(
          c.mode,
          isSelected && c.active,
          (localSelected && c.current) || undefined,
          queue.searchingMode !== undefined && !isSelected && c.disabled,
          lockedCuzNewbie && c.disabled,
        )}
        onClick={() => {
          if (lockedCuzNewbie) return;
          if (!(queue.searchingMode !== undefined && !isSelected)) {
            onSelect(mode, version);
          }
        }}
      >
        <span>{formatGameMode(mode)}</span>
        {unrankedGamesLeft && unrankedGamesLeft > 0 ? (
          <span className={"info"}>
            {unrankedGamesLeft} игр до разблокировки режима
          </span>
        ) : (
          <span className={"info"}>
            {queue.inQueueCount(mode, version)} в поиске
          </span>
        )}
      </div>
    );
  },
);
