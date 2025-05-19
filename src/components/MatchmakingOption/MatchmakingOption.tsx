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
import { pluralize } from "@/util/pluralize";
import { QueueDurationDto } from "@/api/back";

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

  queueTime: QueueDurationDto[];
}

const getLocalFromUtcHours = (hours: number) => {
  let d = new Date();
  d.setUTCHours(hours, 0, 0);

  if (Date.now() > d.getTime()) {
    d = new Date(d.getTime() + 1000 * 60 * 60 * 24);
  }

  let expectedWait = d.getTime() - Date.now();

  if (expectedWait < 0) {
    expectedWait = 1000 * 60 * 60 * 24 - expectedWait;
  }

  const hrs = Math.ceil(expectedWait / 1000 / 60 / 60);

  return `${hrs} ${pluralize(hrs, "час", "часа", "часов")}`;
};
const formatQueueTime = (duration: number) => {
  const minutes = Math.ceil(duration / 60);

  if (minutes > 5) {
    return `±${25} ${pluralize(25, "минута", "минуты", "минут")}`;
  }

  return `±${minutes} ${pluralize(minutes, "минута", "минуты", "минут")}`;
};

const findNextDefinedUtcHourQueueTime = (
  utcHour: number,
  queueTimes: QueueDurationDto[],
): QueueDurationDto | undefined => {
  for (let i = 0; i < 30; i++) {
    const nextUtcHour = (utcHour + i) % 24;
    const qTime = queueTimes.find((t) => t.utcHour === nextUtcHour);
    if (qTime?.duration) {
      return qTime;
    }
  }
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

    const currentQueueTime = queueTime.find(
      (t) => t.utcHour === new Date().getUTCHours(),
    )!;

    const nextDefinedQueueTime = findNextDefinedUtcHourQueueTime(
      new Date().getUTCHours(),
      queueTime,
    );

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
              "Ориентир по времени поиска. Расчитывается из исторических данных"
            }
            className={c.modeAdditional__time}
          >
            <span>
              <CgSandClock />{" "}
              {currentQueueTime?.duration ? (
                <>Время поиска: {formatQueueTime(currentQueueTime.duration)}</>
              ) : nextDefinedQueueTime?.duration ? (
                <>
                  Игры обычно начинаются через{" "}
                  {getLocalFromUtcHours(nextDefinedQueueTime.utcHour)}
                </>
              ) : (
                "Неизвестно"
              )}
            </span>
          </Tooltipable>
        </div>
      </div>
    );
  },
);
