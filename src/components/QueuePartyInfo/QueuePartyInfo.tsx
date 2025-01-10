import React, { useCallback, useState } from "react";

import c from "./QueuePartyInfo.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { PartyMemberDTO } from "@/api/back";
import { InvitePlayerModal, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";

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

export const QueuePartyInfo = observer(function QueuePartyInfo() {
  const { queue } = useStore();
  const { data } = getApi().playerApi.usePlayerControllerMyParty();
  const { data: onlineData } = getApi().statsApi.useStatsControllerOnline();

  // const ping = usePing(1000);

  const party = queue.party;

  const [inviteOpen, setInviteOpen] = useState(false);

  const close = useCallback(() => setInviteOpen(false), []);

  if (!queue.ready) {
    return <GameCoordinatorConnection readyState={queue.readyState} />;
  }

  const isSoloParty = party?.players?.length === 1;

  return (
    <div className={c.info}>
      {inviteOpen && <InvitePlayerModal isOpen={inviteOpen} close={close} />}

      <div className={c.party}>
        {(party?.players || []).map((t: PartyMemberDTO) => (
          <PageLink
            key={t.summary.user.steamId}
            link={AppRouter.players.player.index(t.summary.user.steamId).link}
          >
            <div
              className={cx(
                c.partyItem,
                t.summary.user.steamId === data?.leader.steamId && c.leader,
                t.banStatus?.isBanned && c.banned,
                t.session && c.playing,
              )}
            >
              <img
                width={50}
                height={50}
                src={t.summary.user.avatar || "/avatar.png"}
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

      {onlineData ? (
        <div className={c.searchGameBar}>
          <span>
            {onlineData.inGame} в игре, {queue.online.length} онлайн
          </span>
          {/*<span>*/}
          {/*  Свободных серверов: {onlineData.servers - onlineData.sessions}*/}
          {/*</span>*/}
          <span>Игр идет: {onlineData.sessions}</span>
        </div>
      ) : null}
    </div>
  );
});
