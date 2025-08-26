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
import { FaLock, FaRobot } from "react-icons/fa";
import { Checkbox, Tooltipable } from "@/components";
import { formatGameMode, formatGameModeDescription } from "@/util/gamemode";
import { QueueDurationDto } from "@/api/back";
import { GiJeweledChalice } from "react-icons/gi";
import { MdSecurity } from "react-icons/md";
import { BiDoorOpen } from "react-icons/bi";
import { useTranslation } from "react-i18next";

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

const DropModes: MatchmakingMode[] = [
  MatchmakingMode.UNRANKED,
  MatchmakingMode.TURBO,
  MatchmakingMode.HIGHROOM,
  MatchmakingMode.RANKED,
];

const AbandonRestrictModes: MatchmakingMode[] = [
  MatchmakingMode.UNRANKED,
  MatchmakingMode.HIGHROOM,
  MatchmakingMode.RANKED,
];

const HasBotsModes: MatchmakingMode[] = [
  MatchmakingMode.TURBO,
  MatchmakingMode.BOTS,
  MatchmakingMode.BOTS2X2,
];

export const MatchmakingOption = observer(
  ({
    mode,
    version,
    onSelect,
    disabled,
    selected,
    localSelected,
    suffix,
    testId,
    // queueTime,
  }: MatchmakingOptionProps) => {
    const { t } = useTranslation();
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
            className={c.mode__select}
            disabled={!!disabled}
            checked={(selected || localSelected) && !disabled}
            onChange={() => onSelect(mode, version)}
          />
          <div
            data-testid={testId}
            className={cx(c.mode, localSelected ? c.mode__current : undefined)}
          >
            <div className={c.modeTitle}>
              <Tooltipable
                tooltip={formatGameModeDescription(mode)}
                className={c.mode__name}
              >
                <span>
                  {disabled ? <FaLock /> : null} {formatGameMode(mode)}
                </span>
              </Tooltipable>
              <div className={c.modeAdditional}>
                {HasBotsModes.includes(mode) && (
                  <Tooltipable
                    tooltip={t("matchmaking_option.botsFillSlots")}
                    className={c.modeAdditional__neutral}
                  >
                    <FaRobot />
                  </Tooltipable>
                )}
                {AbandonRestrictModes.includes(mode) && (
                  <Tooltipable
                    tooltip={t("matchmaking_option.strictPenalties")}
                    className={c.modeAdditional__bad}
                  >
                    <MdSecurity />
                  </Tooltipable>
                )}
                {!AbandonRestrictModes.includes(mode) && (
                  <Tooltipable
                    tooltip={t("matchmaking_option.noPenalties")}
                    className={c.modeAdditional__neutral}
                  >
                    <BiDoorOpen />
                  </Tooltipable>
                )}
                {DropModes.includes(mode) && (
                  <Tooltipable
                    tooltip={t("matchmaking_option.dropRewards")}
                    className={c.modeAdditional__good}
                  >
                    <GiJeweledChalice />
                  </Tooltipable>
                )}
              </div>
            </div>

            {disabled ? (
              <span className={c.mode__disabledBy}>{disabled}</span>
            ) : null}
            {suffix && <span className={c.mode__suffix}>{suffix}</span>}
          </div>
        </div>
        <span className={c.mode__inQueue}>
          {queue.inQueueCount(mode, version)} {t("matchmaking_option.inQueue")}
        </span>
      </div>
    );
  },
);
