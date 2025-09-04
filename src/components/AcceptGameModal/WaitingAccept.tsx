import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { AppRouter } from "@/route";
import { ReadyState } from "@/store/queue/messages/s2c/player-room-state-message.s2c";
import { useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";

interface Props {
  className?: string;
}
export const WaitingAccept = observer((p: Props) => {
  const { t } = useTranslation();
  const { queue, user } = useStore();

  if (!queue.roomState) return null;
  const sortedEntries = [...queue.roomState.entries].sort((a, b) => {
    const isInPartyA =
      queue.party?.players?.findIndex(
        (partyPlayer) => partyPlayer.summary?.id === a.steamId,
      ) !== -1;
    const isInPartyB =
      queue.party?.players?.findIndex(
        (partyPlayer) => partyPlayer.summary?.id === b.steamId,
      ) !== -1;

    if (isInPartyB === isInPartyA)
      return parseInt(b.steamId) - parseInt(a.steamId);

    return isInPartyB ? 1 : -1;
  });
  return (
    <div className={cx(p.className)} data-testid="accept-modal-waiting-others">
      <div className={c.header}>
        <h3>{t(`matchmaking_mode.${queue.roomState!.mode}`)}</h3>
        <h4 style={{ marginTop: 12 }}>
          {queue.serverSearching
            ? t("waiting_accept.searchingServer")
            : t("waiting_accept.waitingForPlayers")}
        </h4>
      </div>
      <div className={c.dots}>
        {sortedEntries.map((entry) => {
          return (
            <PageLink
              key={entry.steamId}
              link={AppRouter.players.player.index(entry.steamId).link}
            >
              <picture
                className={cx(c.avatarPreview, {
                  [c.accepted]: entry.state === ReadyState.READY,
                  [c.pending]: entry.state === ReadyState.PENDING,
                  [c.timeout]: entry.state === ReadyState.TIMEOUT,
                  [c.decline]: entry.state === ReadyState.DECLINE,
                })}
              >
                <img
                  src={
                    user.tryGetUser(entry.steamId)?.entry?.user?.avatar ||
                    "/avatar.png"
                  }
                />
              </picture>
            </PageLink>
          );
        })}
      </div>
    </div>
  );
});
