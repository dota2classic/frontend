import { MatchGameDto, ParticipantResultDto } from "@/api/back";
import c from "./MatchInfoModal.module.scss";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import cx from "clsx";
import { UserPreview } from "@/components/UserPreview";

interface Props {
  game: MatchGameDto;
}

interface LineupProps {
  opponent?: ParticipantResultDto;
}
const RenderTeamLineup = ({ opponent }: LineupProps) => {
  // No opponent - we are waiting for it
  if (!opponent) {
    return (
      <div className={c.card}>
        <header className={cx(c.heading, c.heading__small)}>
          <span>Еще неизвестен</span>
        </header>
      </div>
    );
  }

  // BYE
  if (opponent.id === null) {
    return (
      <div className={c.card}>
        <header className={cx(c.heading, c.heading__small)}>
          <span>Пропуск - соперника нет</span>
        </header>
      </div>
    );
  }

  return (
    <div className={c.card}>
      <header className={cx(c.heading, c.heading__small)}>
        <span>Команда {opponent.participant?.name}</span>
      </header>
      {opponent.participant?.players?.map((player) => (
        <UserPreview key={player.steamId} user={player} />
      ))}
    </div>
  );
};

export const MatchGameCard = ({ game }: Props) => {
  return (
    <div className={c.card}>
      <header className={c.heading}>
        <span>Игра {game.number}</span>
        <MatchStatusBadge status={game.status} />
      </header>

      <RenderTeamLineup opponent={game.opponent1} />
      <RenderTeamLineup opponent={game.opponent2} />
    </div>
  );
};
