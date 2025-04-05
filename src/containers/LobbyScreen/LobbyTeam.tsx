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
  maxSlots: number;
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
    maxSlots,
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
          {new Array(maxSlots).fill(null).map((_, index) => {
            const slot = slots.find((t) => t.index === index);

            if (slot)
              return (
                <div
                  key={slot.user.steamId}
                  className={cx(c.slot, c.playerPreview)}
                >
                  <PlayerAvatar
                    src={slot.user.avatar}
                    width={34}
                    height={34}
                    alt={""}
                  />
                  <span className={c.username}>{slot.user.name}</span>
                  {canRemove(slot.user) && (
                    <Tooltipable tooltip={`Убрать из команды`}>
                      <IconButton
                        onClick={() => onRemoveSlot(index, slot!.user.steamId)}
                      >
                        <IoMdClose />
                      </IconButton>
                    </Tooltipable>
                  )}
                  {canRemove(slot.user) && (
                    <Tooltipable tooltip={`Выгнать из лобби`}>
                      <IconButton
                        onClick={() => onKickPlayer(slot!.user.steamId)}
                      >
                        <IoMdExit />
                      </IconButton>
                    </Tooltipable>
                  )}
                </div>
              );

            return (
              <div key={`inactive-${index}`} className={c.slot}>
                <span className={c.takeSlot} onClick={() => onTakeSlot(index)}>
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
