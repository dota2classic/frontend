import React from "react";

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
import { NotificationSetting } from "@/components/MatchmakingModeList/NotificationSetting";
import { observer } from "mobx-react-lite";

interface IMatchmakingModeListProps {
  modes: MatchmakingInfo[];
}

export const MatchmakingModeList: React.FC<IMatchmakingModeListProps> =
  observer(({ modes }) => {
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
      <Section className={cx(c.modes)}>
        <header>Режим игры</header>
        <div className={cx(c.modes__list)}>
          <div
            className={cx(
              c.modes__list,
              c.modes__list_inner,
              "onboarding-mode-list",
            )}
          >
            {d84.map((info) => {
              const modeDisabledBy = modEnableCondition(queue, info.lobbyType);
              const isSearchedMode: boolean = queue.queueState?.inQueue
                ? queue.queueState.modes.includes(info.lobbyType)
                : false;

              const isLocalSelected = queue.selectedModes.includes(
                info.lobbyType,
              );
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
                  queueTime={info.queueDuration}
                  suffix={
                    isCalibration &&
                    info.lobbyType === MatchmakingMode.UNRANKED &&
                    !modeDisabledBy ? (
                      <>
                        еще{" "}
                        <span className="gold">
                          {me?.summary?.calibrationGamesLeft}
                        </span>{" "}
                        калибровочных игр
                      </>
                    ) : undefined
                  }
                />
              );
            })}
          </div>
          <NotificationSetting />
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
