import c from "@/components/EditMatchModal/EditMatchModal.module.scss";
import { Input } from "@/components/Input";
import cx from "clsx";
import { Table } from "@/components/Table";
import { Button } from "@/components/Button";
import React from "react";
import { MatchGameDto, MatchStatus } from "@/api/back";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { TimeAgo } from "@/components/TimeAgo";
import DatePicker from "react-datepicker";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";

interface Props {
  game: MatchGameDto;
  schedule: (gameId: string, date: Date) => void;
  setWinner: (gameId: string, opponentId: number) => void;
  resetGame: (gameId: string) => void;
}

export const EditGame = ({ game, schedule, setWinner, resetGame }: Props) => {
  const sd = (game.scheduledDate && new Date(game.scheduledDate)) || undefined;
  const gameComplete = game.status >= MatchStatus.Completed;

  return (
    <div key={game.id} className={c.game}>
      <span>
        Игра #{game.number} <MatchStatusBadge status={game.status} />
      </span>
      <span className={c.link}>
        {(game.externalMatchId && (
          <PageLink
            className="link"
            link={AppRouter.matches.match(game.externalMatchId).link}
          >
            Ссылка на матч
          </PageLink>
        )) || <span>Без игры</span>}
      </span>
      <h4>Время начала игры(обновит все последующие игры)</h4>
      {gameComplete ? (
        (sd && <TimeAgo date={sd} />) || <span>wtf</span>
      ) : (
        <DatePicker
          disabled={gameComplete}
          date={sd}
          selected={sd}
          onChange={(d) => schedule(game.id, d!)}
          showTimeSelect
          timeIntervals={1}
          dateFormat={"dd MMMM yyyy HH:mm"}
          customInput={<Input className={cx("iso")} />}
        />
      )}
      <h4>Результат</h4>
      <Table className="compact">
        <tbody>
          <tr>
            <td>{game.opponent1?.participant?.name}</td>
            <td>Результат: {game.opponent1?.result || "-"}</td>
            <td>
              <Button
                onClick={() => setWinner(game.id, game.opponent1!.id!)}
                disabled={gameComplete}
              >
                Победил
              </Button>
            </td>
          </tr>
          <tr>
            <td>{game.opponent2?.participant?.name}</td>
            <td>Результат: {game.opponent2?.result || "-"}</td>
            <td>
              <Button
                onClick={() => setWinner(game.id, game.opponent2!.id!)}
                disabled={gameComplete}
              >
                Победил
              </Button>
              <Button
                disabled={game.status != MatchStatus.Running}
                onClick={() => resetGame(game.id)}
              >
                Запустить игру заново
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
