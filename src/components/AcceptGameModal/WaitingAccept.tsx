import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import { formatGameMode } from "@/util/gamemode";
import { ReadyState } from "@/store/queue/messages/s2c/player-room-state-message.s2c";

interface Props {
  className?: string;
}
export const WaitingAccept = observer((p: Props) => {
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
    <div className={cx(p.className)}>
      <div className={c.header}>
        <h3>{formatGameMode(queue.roomState.mode)}</h3>
        <h4 style={{ marginTop: 12 }}>Ожидаем других игроков</h4>
      </div>
      <div className={c.dots}>
        {sortedEntries.map((entry) => {
          return (
            <PageLink
              key={entry.steamId}
              link={AppRouter.players.player.index(entry.steamId).link}
            >
              <img
                className={cx(c.avatarPreview, {
                  [c.accepted]: entry.state === ReadyState.READY,
                  [c.pending]: entry.state === ReadyState.PENDING,
                  [c.timeout]: entry.state === ReadyState.TIMEOUT,
                  [c.decline]: entry.state === ReadyState.DECLINE,
                })}
                src={
                  user.tryGetUser(entry.steamId)?.entry?.user?.avatar ||
                  "/avatar.png"
                }
                alt={`Avatar of player ${entry.steamId}`}
              />
            </PageLink>
          );
        })}
      </div>
    </div>
  );
});
