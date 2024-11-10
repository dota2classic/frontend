import React, { ReactNode } from "react";

import c from "./MatchmakingOption.module.scss";
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";
import { formatGameMode } from "@/util/gamemode";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "classnames";
import { FaLock } from "react-icons/fa";

interface MatchmakingOptionProps {
  mode: MatchmakingMode;
  version: Dota2Version;
  onSelect: (mode: MatchmakingMode, version: Dota2Version) => void;
  disabled: ReactNode;
}

export const MatchmakingOption = observer(
  ({ mode, version, onSelect, disabled }: MatchmakingOptionProps) => {
    const { queue } = useStore();

    const localSelected =
      queue.selectedMode?.mode === mode &&
      queue.selectedMode?.version === version;

    const isSelected =
      queue.searchingMode?.mode === mode &&
      queue.searchingMode?.version === version;

    return (
      <div
        className={cx(
          c.mode,
          isSelected && c.active,
          (localSelected && c.current) || undefined,
          queue.searchingMode !== undefined && !isSelected && c.disabled,
          disabled && c.disabled,
        )}
        onClick={() => {
          if (disabled) return;
          if (!(queue.searchingMode !== undefined && !isSelected)) {
            onSelect(mode, version);
          }
        }}
      >
        <span className={c.mode__name}>
          {disabled ? <FaLock /> : null} {formatGameMode(mode)}
        </span>
        <span>
          {disabled ? (
            <>{disabled}</>
          ) : (
            <>{queue.inQueueCount(mode, version)} в поиске</>
          )}
        </span>
      </div>
    );
  },
);
