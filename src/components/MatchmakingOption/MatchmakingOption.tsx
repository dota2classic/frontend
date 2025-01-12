import React, { ReactNode } from "react";

import c from "./MatchmakingOption.module.scss";
import {
  Dota2Version,
  DotaGameMode,
  MatchmakingMode,
} from "@/api/mapped-models";
import { formatDotaMode, formatGameMode } from "@/util/gamemode";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "clsx";
import { FaLock } from "react-icons/fa";

interface MatchmakingOptionProps {
  mode: MatchmakingMode;
  dotaMode: DotaGameMode;
  version: Dota2Version;
  onSelect: (mode: MatchmakingMode, version: Dota2Version) => void;
  selected: boolean;
  localSelected: boolean;
  disabled: ReactNode;

  suffix?: ReactNode;
  testId?: string;
}

export const MatchmakingOption = observer(
  ({
    mode,
    dotaMode,
    version,
    onSelect,
    disabled,
    selected,
    localSelected,
    suffix,
    testId,
  }: MatchmakingOptionProps) => {
    const { queue } = useStore();

    return (
      <div
        data-testid={testId}
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
        <div className={c.modeTitle}>
          <span className={c.mode__name}>
            {disabled ? <FaLock /> : null} {formatGameMode(mode)}
          </span>
          <span className={"green"}>{formatDotaMode(dotaMode)}</span>
        </div>

        <span>
          {disabled ? (
            <>{disabled}</>
          ) : (
            <>
              {queue.inQueueCount(mode, version)} в поиске,{" "}
              {queue.inGameCount(mode)} в игре
            </>
          )}
        </span>
        {suffix && <span className={c.mode__suffix}>{suffix}</span>}
      </div>
    );
  },
);
