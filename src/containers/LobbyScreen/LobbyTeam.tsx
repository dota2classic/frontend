import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { LobbySlotDto, UserDTO } from "@/api/back";
import c from "@/pages/lobby/Lobby.module.scss";
import cx from "clsx";
import { IconButton, PlayerAvatar, Tooltipable } from "@/components";
import { IoMdClose, IoMdExit } from "react-icons/io";

interface TeamProps {
  isOwner: boolean;
  slots: LobbySlotDto[];
  onTakeSlot: (index: number) => void;
  team: number | undefined;
  onRemoveSlot: (index: number, steamId: string) => void;
  onKickPlayer: (steamId: string) => void;
}

export const LobbyTeam = observer(
  ({
    slots,
    isOwner,
    onTakeSlot,
    onRemoveSlot,
    team,
    onKickPlayer,
  }: TeamProps) => {
    const { auth } = useStore();
    const canRemove = (u: UserDTO) =>
      isOwner || auth.parsedToken?.sub === u.steamId;
    return (
      <div className={c.grid4}>
        <h2 className={cx(c.team, team === 2 && "green", team == 3 && "red")}>
          {team === 2
            ? "Силы света"
            : team === 3
              ? "Силы тьмы"
              : "Неопределившиеся"}
        </h2>
        <div className={c.slots}>
          {slots
            .filter((t) => t.team === team)
            .sort((a, b) => a.index - b.index)
            .map((teamSlot) => {
              const slotHasPlayer = teamSlot?.user;

              if (slotHasPlayer)
                return (
                  <div
                    key={`${teamSlot?.team}_${teamSlot?.index}`}
                    className={cx(c.slot, c.playerPreview)}
                  >
                    <PlayerAvatar
                      user={slotHasPlayer}
                      width={34}
                      height={34}
                      alt={""}
                    />
                    <span className={c.username}>{slotHasPlayer.name}</span>

                    {canRemove(slotHasPlayer) && (
                      <Tooltipable tooltip={`Убрать из команды`}>
                        <IconButton
                          onClick={() =>
                            onRemoveSlot(teamSlot.index, slotHasPlayer!.steamId)
                          }
                        >
                          <IoMdClose />
                        </IconButton>
                      </Tooltipable>
                    )}
                    {canRemove(slotHasPlayer) && (
                      <Tooltipable tooltip={`Выгнать из лобби`}>
                        <IconButton
                          onClick={() => onKickPlayer(slotHasPlayer!.steamId)}
                        >
                          <IoMdExit />
                        </IconButton>
                      </Tooltipable>
                    )}
                  </div>
                );

              return (
                <div
                  key={`inactive_${teamSlot?.team}_${teamSlot?.index}`}
                  className={c.slot}
                >
                  <span
                    className={c.takeSlot}
                    onClick={() => onTakeSlot(teamSlot.index)}
                  >
                    Занять место
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  },
);
