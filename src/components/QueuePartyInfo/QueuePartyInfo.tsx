import React, { useCallback, useState } from "react";

import c from "./QueuePartyInfo.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useApi } from "@/api/hooks";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { UserDTO } from "@/api/back";
import { InvitePlayerModal, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import cx from "classnames";
import { formatGameMode } from "@/util/gamemode";

const GameCoordinatorConnection = ({
  readyState,
}: {
  readyState: GameCoordinatorState;
}) => {
  const { queue } = useStore();

  return (
    <div className={c.info}>
      {readyState === GameCoordinatorState.DISCONNECTED ? (
        <div className={c.searchGameBar}>Подключение к координатору...</div>
      ) : (
        <div className={c.searchGameBar}>Авторизуемся...</div>
      )}
    </div>
  );
};

export const QueuePartyInfo = observer(() => {
  const { queue } = useStore();
  const { data } = useApi().playerApi.usePlayerControllerMyParty();

  const { data: party } = useApi().playerApi.usePlayerControllerMyParty();

  const [inviteOpen, setInviteOpen] = useState(false);

  const close = useCallback(() => setInviteOpen(false), []);

  if (!queue.ready) {
    return <GameCoordinatorConnection readyState={queue.readyState} />;
  }

  const isSoloParty = party?.players?.length === 1;

  return (
    <Panel className={c.info}>
      <InvitePlayerModal isOpen={inviteOpen} close={close} />

      <div className={c.party}>
        {party!.players.map((t: UserDTO) => (
          <PageLink
            key={t.steamId}
            link={AppRouter.players.player.index(t.steamId).link}
          >
            <div
              className={cx(
                c.partyItem,
                t.steamId === data?.leader.steamId && c.leader,
              )}
            >
              <img src={t.avatar} alt="" />
            </div>
          </PageLink>
        ))}

        <div
          className={cx(c.partyItem, c.invite)}
          onClick={(e: any) => {
            e.nativeEvent.nasty = true;
            setInviteOpen(true);
          }}
        >
          <img src={`/plus.png`} alt="" />
        </div>
      </div>

      {!isSoloParty && (
        <div className={c.cancelSearch} onClick={() => queue.leaveParty()}>
          Покинуть группу
        </div>
      )}

      {/*<SearchGameButton />*/}

      {queue.searchingMode !== undefined && (
        <div className={c.searchGameBar}>
          <span>Поиск {formatGameMode(queue.searchingMode!.mode)}</span>
          <span className={"info"}>
            В поиске{" "}
            {queue.inQueueCount(
              queue.searchingMode.mode,
              queue.searchingMode.version,
            )}
          </span>
        </div>
      )}
    </Panel>
  );
});
