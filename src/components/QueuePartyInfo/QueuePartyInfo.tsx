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
import { useTranslation } from "react-i18next";

const GameCoordinatorConnection = ({
  readyState,
}: {
  readyState: GameCoordinatorState;
}) => {
  const { t } = useTranslation();
  return (
    <div className={c.info}>
      {readyState === GameCoordinatorState.DISCONNECTED ? (
        <div className={c.searchGameBar}>
          {t("queue_party_info.disconnected")}
        </div>
      ) : (
        <div className={c.searchGameBar}>
          {t("queue_party_info.authorizing")}
        </div>
      )}
    </div>
  );
};

export const QueuePartyInfo = observer(function QueuePartyInfo() {
  const { queue } = useStore();

  const party = queue.party;

  const onlineData = queue.onlineData;

  const [inviteOpen, setInviteOpen] = useState(false);

  const close = useCallback(() => setInviteOpen(false), []);

  const { t } = useTranslation();

  const invite = useCallback(
    async (it: UserDTO) => {
      queue.inviteToParty(it.steamId);
      makeSimpleToast(
        t("queue_party_info.invitationSent", { name: it.name }),
        "",
        5000,
      );
      close();
    },
    [close, queue, t],
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
                t.summary.banStatus?.isBanned && c.banned,
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
          tooltip={t("queue_party_info.inviteToGroup")}
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
          {t("queue_party_info.leaveGroup")}
        </div>
      )}

      {onlineData ? (
        <Tooltipable
          className={cx(c.searchGameBar, "onboarding-online-stats")}
          tooltip={t("queue_party_info.onlineStatus", {
            count: onlineData.inGame,
            onlineCount: queue.online.length,
          })}
        >
          <div>
            <span>
              {t(`queue_party_info.onlineStatusShort`, {
                inGame: onlineData.inGame,
                online: queue.online.length,
              })}
            </span>
            <span>
              {t(`queue_party_info.currentGames`, {
                games: onlineData.sessions,
              })}
            </span>
          </div>
        </Tooltipable>
      ) : null}
    </div>
  );
});
