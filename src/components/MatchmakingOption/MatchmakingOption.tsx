import React, { ReactNode } from "react";

import c from "./MatchmakingOption.module.scss";
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";
import { formatGameMode } from "@/util/gamemode";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "clsx";
import { FaLock } from "react-icons/fa";

interface MatchmakingOptionProps {
  mode: MatchmakingMode;
  version: Dota2Version;
  onSelect: (mode: MatchmakingMode, version: Dota2Version) => void;
  selected: boolean;
  localSelected: boolean;
  disabled: ReactNode;
}

export const MatchmakingOption = observer(
  ({
    mode,
    version,
    onSelect,
    disabled,
    selected,
    localSelected,
  }: MatchmakingOptionProps) => {
    const { queue } = useStore();

    return (
      <div
        className={cx(
          c.mode,
          localSelected ? c.mode__current : undefined,
          selected ? c.mode__active : undefined,
          disabled ? c.mode__disabled : undefined,
        )}
        onClick={() => {
          if (!queue.queueState && !selected) {
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
