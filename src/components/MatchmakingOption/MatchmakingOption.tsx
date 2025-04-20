import React, { ReactNode } from "react";

import c from "./MatchmakingOption.module.scss";
import {
  Dota2Version,
  DotaGameMode,
  MatchmakingMode,
} from "@/api/mapped-models";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import cx from "clsx";
import { FaLock } from "react-icons/fa";
import { Checkbox, Tooltipable } from "@/components";
import { formatDotaMode, formatGameMode } from "@/util/gamemode";
import { CgSandClock } from "react-icons/cg";

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

  queueTime?: number;
}

const formatQueueTime = (duration?: number) => {
  if (!duration) {
    return "Неизвестно";
  }
  const minutes = Math.floor(duration / 60);

  if (minutes == 0) {
    return "Меньше минуты";
  }

  return `±${minutes} минут`;
};

export const MatchmakingOption = observer(
  ({
    mode,
    version,
    onSelect,
    disabled,
    selected,
    localSelected,
    dotaMode,
    suffix,
    testId,
    queueTime,
  }: MatchmakingOptionProps) => {
    const { queue } = useStore();

    return (
      <div
        className={cx(
          c.modeOption,
          (queue.queueState?.inQueue || disabled) && c.locked,
          disabled && c.disabled,
          selected ? c.mode__active : undefined,
        )}
        onClick={() => {
          onSelect(mode, version);
        }}
      >
        <div className={c.modeMain}>
          <Checkbox
            disabled={!!disabled}
            checked={(selected || localSelected) && !disabled}
            onChange={() => onSelect(mode, version)}
          />
          <div
            data-testid={testId}
            className={cx(c.mode, localSelected ? c.mode__current : undefined)}
          >
            <div className={c.modeTitle}>
              <span className={c.mode__name}>
                {disabled ? <FaLock /> : null}{" "}
                {mode === MatchmakingMode.HIGHROOM
                  ? formatDotaMode(dotaMode)
                  : formatGameMode(mode)}
              </span>
              <span className={c.mode__inQueue}>
                {queue.inQueueCount(mode, version)} в поиске
              </span>
            </div>

            {disabled ? (
              <span className={c.mode__disabledBy}>{disabled}</span>
            ) : null}
            {suffix && <span className={c.mode__suffix}>{suffix}</span>}
          </div>
        </div>

        <div className={c.modeAdditional}>
          <Tooltipable
            tooltip={
              queueTime
                ? "Примерное время поиска игры"
                : "В этом время игры крайне редки :("
            }
            className={c.modeAdditional__time}
          >
            <span>
              <CgSandClock /> {formatQueueTime(queueTime)}
            </span>
          </Tooltipable>
        </div>
      </div>
    );
  },
);
