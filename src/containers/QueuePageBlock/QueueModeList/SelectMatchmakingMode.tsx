import { MatchmakingMode } from "@/api/mapped-models";
import React, { useCallback } from "react";
import cx from "clsx";
import { Checkbox } from "@/components/Checkbox";
import { Tooltipable } from "@/components/Tooltipable";
import { FaLock, FaRobot } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { BiDoorOpen } from "react-icons/bi";
import { GiJeweledChalice } from "react-icons/gi";
import c from "./QueueModeList.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useTranslation } from "react-i18next";
import { modEnableCondition } from "@/containers/QueuePageBlock/QueueModeList/utils";

interface Props {
  mode: MatchmakingMode;
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

export const SelectMatchmakingMode: React.FC<Props> = observer(({ mode }) => {
  const { queue } = useStore();
  const { t } = useTranslation();

  const onSelectMode = useCallback(() => {
    if (queue.queueState?.inQueue) return;
    // if (modeDisabledBy) return;
    queue.toggleMode(mode);
  }, [mode, queue]);

  const disabled = modEnableCondition(queue, mode, t);

  const isSearchedMode: boolean = queue.queueState?.inQueue
    ? queue.queueState.modes.includes(mode)
    : false;

  const isLocalSelected = queue.selectedModes.includes(mode);

  return (
    <div
      className={cx(
        c.modeOption,
        (queue.queueState?.inQueue || disabled) && c.locked,
        // disabled && c.disabled,
        isSearchedMode ? c.mode__active : undefined,
      )}
      onClick={onSelectMode}
    >
      <div className={c.modeMain}>
        <Checkbox
          className={c.mode__select}
          disabled={!!disabled}
          checked={(isSearchedMode || isLocalSelected) && !disabled}
          onChange={onSelectMode}
        />
        <div>
          <div className={c.modeTitle}>
            <Tooltipable
              tooltip={t(`matchmaking_mode_description.${mode}`)}
              className={c.mode__name}
            >
              <span>
                {disabled ? <FaLock /> : null} {t(`matchmaking_mode.${mode}`)}
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
        </div>
      </div>
      <span className={c.mode__inQueue}>
        {queue.inQueueCount(mode)} {t("matchmaking_option.inQueue")}
      </span>
    </div>
  );
});
