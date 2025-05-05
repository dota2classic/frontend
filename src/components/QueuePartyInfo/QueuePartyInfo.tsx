import React, { useCallback, useState } from "react";

import c from "./QueuePartyInfo.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { PartyMemberDTO, UserDTO } from "@/api/back";
import { InvitePlayerModalRaw, PageLink, Tooltipable } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import { createPortal } from "react-dom";
import { makeSimpleToast } from "@/components/Toast/toasts";
import {pluralize} from "@/util/pluralize";

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
  const { queue, notify } = useStore();

  const party = queue.party;

  const onlineData = queue.onlineData;

  const [inviteOpen, setInviteOpen] = useState(false);

  const close = useCallback(() => setInviteOpen(false), []);

  const invite = useCallback(
    async (it: UserDTO) => {
      queue.inviteToParty(it.steamId);
      makeSimpleToast(`Приглашение отправлено ${it.name}`, "", 5000);
      close();
    },
    [close, notify, queue],
  );

  if (!queue.ready) {
    return <GameCoordinatorConnection readyState={queue.readyState} />;
  }

  const isSoloParty = party?.players?.length === 1;

  return (
    <div className={c.info}>
      {inviteOpen &&
        createPortal(
          <InvitePlayerModalRaw close={close} onSelect={invite} />,
          document.body,
        )}

      <div className={cx(c.party, "onboarding-party")}>
        {(party?.players || []).map((t: PartyMemberDTO) => (
          <PageLink
            key={t.summary.user.steamId}
            link={AppRouter.players.player.index(t.summary.user.steamId).link}
          >
            <div
              className={cx(
                c.partyItem,
                t.summary.user.steamId === party?.leader.steamId && c.leader,
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

        <Tooltipable
          tooltip={"Пригласить в группу"}
          className={cx(c.partyItem, c.invite)}
        >
          <div
            onClick={(e: React.MouseEvent) => {
              // Some hacking to do
              (e.nativeEvent as { nasty?: boolean }).nasty = true;
              setInviteOpen(true);
            }}
          >
            <img width={50} height={50} src={`/plus.png`} alt="" />
          </div>
        </Tooltipable>
      </div>

      {!isSoloParty && (
        <div className={c.cancelSearch} onClick={() => queue.leaveParty()}>
          Покинуть группу
        </div>
      )}

      {onlineData ? (
        <Tooltipable
          className={cx(c.searchGameBar, "onboarding-online-stats")}
          tooltip={`${onlineData.inGame} сейчас ${pluralize(onlineData.inGame, "играет", "играет", "играют")}, у ${queue.online.length} открыта вкладка в браузере`}
        >
          <div>
            <span>
              {onlineData.inGame} в игре, {queue.online.length} онлайн
            </span>
            <span>Игр идет: {onlineData.sessions}</span>
          </div>
        </Tooltipable>
      ) : null}
    </div>
  );
});
