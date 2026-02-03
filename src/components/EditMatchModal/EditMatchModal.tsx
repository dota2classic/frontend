import React, { useCallback } from "react";
import { GenericModal } from "@/components/GenericModal";
import { BracketMatchDto } from "@/api/back";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import c from "./EditMatchModal.module.scss";
import cx from "clsx";
import { getApi } from "@/api/hooks";
import { handleException } from "@/util/handleException";
import { NotoSans } from "@/const/notosans";
import { EditGame } from "@/components/EditMatchModal/EditGame";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { Table } from "@/components/Table";

interface IEditMatchModalProps {
  match: BracketMatchDto;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditMatchModal: React.FC<IEditMatchModalProps> = ({
  match,
  onClose,
  onUpdated,
}) => {
  const schedule = useCallback(
    async (gameId: string, d: Date) => {
      try {
        await getApi().tournament.tournamentControllerScheduleGame(match.id, {
          gameId,
          scheduledDate: d.toISOString(),
        });
        // onClose();
        onUpdated();
      } catch (e) {
        await handleException("Ошибка при обновлении игры", e);
      }
    },
    [match.id, onUpdated],
  );

  const setWinner = useCallback(
    async (gameId: string, winnerId: number) => {
      try {
        await getApi().tournament.tournamentControllerSetGameWinner(match.id, {
          gameId,
          winnerId,
        });
        onUpdated();
      } catch (e) {
        await handleException("Ошибка при обновлении игры", e);
      }
    },
    [match.id, onUpdated],
  );

  return (
    <GenericModal
      className={c.modal}
      onClose={onClose}
      title={"Редактирование матча"}
    >
      <QueuePageBlock heading={"Матч"}>
        <Table>
          <tbody>
            <tr>
              <td>Статус</td>
              <td>
                <MatchStatusBadge status={match.status} />
              </td>
            </tr>
          </tbody>
        </Table>
      </QueuePageBlock>
      <QueuePageBlock heading={"Игры"}>
        <div className={cx(c.games, NotoSans.className)}>
          {match.games
            .sort((a, b) => a.number - b.number)
            .map((game) => (
              <EditGame
                setWinner={setWinner}
                key={game.id}
                game={game}
                schedule={schedule}
              />
            ))}
        </div>
      </QueuePageBlock>
    </GenericModal>
  );
};
