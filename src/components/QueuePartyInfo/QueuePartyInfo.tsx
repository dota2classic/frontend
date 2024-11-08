import React, { useCallback, useState } from "react";

import c from "./QueuePartyInfo.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
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
  const { data } = getApi().playerApi.usePlayerControllerMyParty();
  const { data: onlineData } = getApi().statsApi.useStatsControllerOnline();

  const { data: party } = getApi().playerApi.usePlayerControllerMyParty();

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
        {(party?.players || []).map((t: UserDTO) => (
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
              <img
                width={50}
                height={50}
                src={t.avatar || "/avatar.png"}
                alt=""
              />
            </div>
          </PageLink>
        ))}

        <div
          className={cx(c.partyItem, c.invite)}
          onClick={(e: React.MouseEvent) => {
            // Some hacking to do
            (e.nativeEvent as { nasty?: boolean }).nasty = true;
            setInviteOpen(true);
          }}
        >
          <img width={50} height={50} src={`/plus.png`} alt="" />
        </div>
      </div>

      {!isSoloParty && (
        <div className={c.cancelSearch} onClick={() => queue.leaveParty()}>
          Покинуть группу
        </div>
      )}

      {/*<SearchGameButton />*/}

      {queue.searchingMode !== undefined ? (
        <div className={cx(c.searchGameBar, c.searchGameBar__pending)}>
          <span>
            Поиск{" "}
            <span className="gold">
              {formatGameMode(queue.searchingMode!.mode)}
            </span>
          </span>
          <span className={"info"}>
            В поиске{" "}
            {queue.inQueueCount(
              queue.searchingMode.mode,
              queue.searchingMode.version,
            )}
          </span>
        </div>
      ) : onlineData ? (
        <div className={c.searchGameBar}>
          <span>
            {onlineData.inGame} в игре, {queue.online} онлайн
          </span>
          <span>
            Свободных серверов: {onlineData.servers - onlineData.sessions}
          </span>
          <span>Игр идет: {onlineData.sessions}</span>
        </div>
      ) : null}
    </Panel>
  );
});
