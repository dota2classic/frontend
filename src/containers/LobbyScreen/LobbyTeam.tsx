import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { LobbySlotDto, UserDTO } from "@/api/back";
import c from "@/pages/lobby/Lobby.module.scss";
import cx from "clsx";
import { IoMdClose, IoMdExit } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Tooltipable } from "@/components/Tooltipable";
import { IconButton } from "@/components/IconButton";

interface TeamProps {
  isOwner: boolean;
  slots: LobbySlotDto[];
  onTakeSlot: (index: number) => void;
  team: number | undefined;
  onRemoveSlot: (index: number, steamId: string) => void;
  onKickPlayer: (steamId: string) => void;
  totalMMR: number;
}

export const LobbyTeam = observer(
  ({
    slots,
    isOwner,
    onTakeSlot,
    onRemoveSlot,
    team,
    onKickPlayer,
    totalMMR,
  }: TeamProps) => {
    const { auth } = useStore();
    const { t } = useTranslation();
    const canRemove = (u: UserDTO) =>
      isOwner || auth.parsedToken?.sub === u.steamId;
    return (
      <div className={c.grid4}>
        <h2 className={cx(c.team, team === 2 && "green", team == 3 && "red")}>
          {team === 2
            ? t("lobby_team.lightForces")
            : team === 3
              ? t("lobby_team.darkForces")
              : t("lobby_team.undefined")}
          <div className={c.mmr}>{totalMMR} mmr</div>
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
                      <Tooltipable
                        tooltip={t("lobby_team.removeFromTeamTooltip")}
                      >
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
                      <Tooltipable
                        tooltip={t("lobby_team.kickFromLobbyTooltip")}
                      >
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
                    {t("lobby_team.takeSlot")}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  },
);
