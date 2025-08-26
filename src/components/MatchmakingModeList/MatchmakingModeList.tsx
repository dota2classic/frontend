import React, { ReactNode } from "react";

import {
  GameReadyModal,
  MatchmakingOption,
  SearchGameButton,
  Section,
} from "..";

import c from "./MatchmakingModeList.module.scss";
import { useStore } from "@/store";
import {
  Dota2Version,
  MatchmakingInfo,
  MatchmakingMode,
  PartyMemberDTO,
} from "@/api/back";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { QueueGameState, useQueueState } from "@/util/useQueueState";
import cx from "clsx";
import { modEnableCondition } from "@/components/MatchmakingOption/utils";
import { WaitingAccept } from "@/components/AcceptGameModal/WaitingAccept";
import { ServerSearching } from "@/components/AcceptGameModal/ServerSearching";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

interface IMatchmakingModeListProps {
  modes: MatchmakingInfo[];
  className?: string;
}

export const MatchmakingModeList: React.FC<IMatchmakingModeListProps> =
  observer(({ modes, className }) => {
    const { t } = useTranslation();
    const { queue, auth } = useStore();

    const me: PartyMemberDTO | undefined = (queue.party?.players || []).find(
      (plr: PartyMemberDTO) => plr.summary.id === auth.parsedToken?.sub,
    );

    const isCalibration = !!me?.summary?.calibrationGamesLeft;

    const d84 = modes!
      .filter((it) => it.enabled)
      .sort(
        (a, b) =>
          getLobbyTypePriority(a.lobbyType) - getLobbyTypePriority(b.lobbyType),
      );

    const queueGameState = useQueueState();

    return (
      <Section className={cx(c.modes, className)}>
        <header>{t("matchmaking_mode_list.gameMode")}</header>
        <div className={cx(c.modes__list)}>
          <div
            className={cx(
              c.modes__list,
              c.modes__list_inner,
              "onboarding-mode-list",
            )}
          >
            {d84.map((info) => {
              const modeDisabledBy = modEnableCondition(
                queue,
                info.lobbyType,
                t,
              );
              const isSearchedMode: boolean = queue.queueState?.inQueue
                ? queue.queueState.modes.includes(info.lobbyType)
                : false;

              const isLocalSelected = queue.selectedModes.includes(
                info.lobbyType,
              );

              let suffix: ReactNode = undefined;

              if (
                isCalibration &&
                info.lobbyType === MatchmakingMode.UNRANKED &&
                !modeDisabledBy
              ) {
                suffix = (
                  <>
                    {" "}
                    {t("matchmaking_mode_list.calibrationGamesLeft", {
                      count: me?.summary?.calibrationGamesLeft,
                    })}{" "}
                  </>
                );
              }
              if (info.lobbyType === MatchmakingMode.HIGHROOM) {
                suffix = <> {t("matchmaking_mode_list.strictPenalties")} </>;
              }
              return (
                <MatchmakingOption
                  testId={`mode-list-option-${info.lobbyType}`}
                  selected={isSearchedMode}
                  localSelected={isLocalSelected}
                  disabled={modeDisabledBy}
                  key={`${info.lobbyType}`}
                  onSelect={() => {
                    if (queue.queueState?.inQueue) return;
                    if (modeDisabledBy) return;
                    queue.toggleMode(info.lobbyType);
                  }}
                  version={Dota2Version.Dota_684}
                  mode={info.lobbyType}
                  dotaMode={info.gameMode}
                  queueTime={info.queueDurations}
                  suffix={suffix}
                />
              );
            })}
          </div>
          {/*<NotificationSetting />*/}
          <div style={{ flex: 1 }} />
          {queueGameState === QueueGameState.NO_GAME && (
            <SearchGameButton visible={true} />
          )}
          {queueGameState === QueueGameState.SERVER_READY && (
            <GameReadyModal className={c.gameReady} />
          )}
          {queueGameState === QueueGameState.READY_CHECK_WAITING_OTHER && (
            <WaitingAccept className={c.gameReady} />
          )}
          {queueGameState === QueueGameState.SEARCHING_SERVER && (
            <ServerSearching className={c.gameReady} />
          )}
        </div>
      </Section>
    );
  });
