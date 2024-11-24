import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { PageLink } from "@/components";
import { ReadyState } from "@/util/messages";
import { AppRouter } from "@/route";
import { formatGameMode } from "@/util/gamemode";

interface Props {
  className?: string;
}
export const WaitingAccept = observer((p: Props) => {
  const { queue, user } = useStore();

  if (!queue.gameInfo) return null;
  const sortedEntries = [...queue.gameInfo.entries].sort((a, b) => {
    const isInPartyA =
      queue.party?.players?.findIndex(
        (partyPlayer) => partyPlayer.summary?.id === a.steam_id,
      ) !== -1;
    const isInPartyB =
      queue.party?.players?.findIndex(
        (partyPlayer) => partyPlayer.summary?.id === b.steam_id,
      ) !== -1;

    if (isInPartyB === isInPartyA)
      return parseInt(b.steam_id) - parseInt(a.steam_id);

    return isInPartyB ? 1 : -1;
  });
  return (
    <div className={cx(p.className)}>
      <div className={c.header}>
        <h3>{formatGameMode(queue.gameInfo.mode)}</h3>
        <h4 style={{ marginTop: 12 }}>Ожидаем других игроков</h4>
      </div>
      <div className={c.dots}>
        {sortedEntries.map((entry) => {
          return (
            <PageLink
              key={entry.steam_id}
              link={AppRouter.players.player.index(entry.steam_id).link}
            >
              <img
                className={cx(c.avatarPreview, {
                  [c.accepted]: entry.state === ReadyState.READY,
                  [c.pending]: entry.state === ReadyState.PENDING,
                  [c.timeout]: entry.state === ReadyState.TIMEOUT,
                  [c.decline]: entry.state === ReadyState.DECLINE,
                })}
                src={
                  user.tryGetUser(entry.steam_id)?.entry?.user?.avatar ||
                  "/avatar.png"
                }
                alt={`Avatar of player ${entry.steam_id}`}
              />
            </PageLink>
          );
        })}
      </div>
    </div>
  );
});
