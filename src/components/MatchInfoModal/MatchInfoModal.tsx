import React, { useMemo, useState } from "react";
import {
  BracketMatchDto,
  MatchGameDto,
  MatchStatus,
  OpponentResult,
  ParticipantResultDto,
} from "@/api/back";
import { GenericModal } from "@/components/GenericModal";
import { Tabs } from "@/components/Tabs";
import { BigTabs } from "@/components/BigTabs";
import { IBigTabsProps } from "@/components/BigTabs/BigTabs";
import { useTranslation } from "react-i18next";
import c from "./MatchInfoModal.module.scss";
import { MatchGameCard } from "./MatchGameCard";
import { TranslationKey } from "@/TranslationKey";
import cx from "clsx";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { AppRouter } from "@/route";
import { Button } from "@/components/Button";
import { TimeAgo } from "@/components/TimeAgo";

type Tabs = "current" | "games";
type Items = IBigTabsProps<Tabs, string>["items"];

interface IMatchInfoModalProps {
  match: BracketMatchDto;
  onClose: () => void;
}

const Team: React.FC<{
  participant?: ParticipantResultDto;
  reverse?: boolean;
}> = ({ participant, reverse }) => {
  const { t } = useTranslation();
  return (
    <div className={cx(c.team, reverse && c.team__reverse)}>
      <div className={c.team__result}>
        {participant?.result && (
          <span
            className={cx(
              participant.result === OpponentResult.Win && "green",
              participant.result === OpponentResult.Loss && "red",
            )}
          >
            {t(`tournament.result.${participant.result}` as TranslationKey)}
          </span>
        )}
        <span className={c.team_name}>
          {participant?.participant?.name || "Еще неизвестен"}
        </span>
      </div>
      <img src={participant?.participant?.avatar || "/avatar.png"} alt="" />
      <span className={c.score}>{participant?.score}</span>
    </div>
  );
};

const Header: React.FC<Omit<IMatchInfoModalProps, "onClose">> = ({ match }) => {
  const { t } = useTranslation();
  return (
    <div className={c.match_info}>
      <span>
        {t(`tournament.best_of.bo${match.childCount}` as TranslationKey)}
      </span>
      <div className={c.teams}>
        <Team participant={match.opponent1} />
        <span className={c.delimeter}>:</span>
        <Team participant={match.opponent2} reverse />
      </div>
    </div>
  );
};

const GamePreview = ({ game }: { game: MatchGameDto }) => {
  return (
    <div className={c.game}>
      <span>Игра #{game.number}</span>
      <MatchStatusBadge status={game.status} />
      <TimeAgo pretty date={new Date(game.scheduledDate!)} />

      <span style={{ flex: 1 }} />

      {game.externalMatchId ? (
        <Button
          variant="primary"
          pageLink={AppRouter.matches.match(game.externalMatchId).link}
        >
          Матч
        </Button>
      ) : (
        <span>Матча нет</span>
      )}
    </div>
  );
};

export const MatchInfoModal: React.FC<IMatchInfoModalProps> = ({
  match,
  onClose,
}) => {
  const [selected, setSelected] = useState<Tabs>("current");
  const { t } = useTranslation();
  const items: Items = [
    {
      key: "current",
      onSelect: setSelected,
      label: t("match_info_modal.tabs.current"),
    },
    {
      key: "games",
      onSelect: setSelected,
      label: t("match_info_modal.tabs.games"),
    },
  ];

  const currentGame = useMemo(() => {
    return (
      match.games
        .sort((a, b) => a.number - b.number)
        .find((t) => t.status < MatchStatus.Completed) ||
      match.games[match.games.length - 1]
    );
  }, [match]);

  return (
    <GenericModal className={c.modal} onClose={onClose} title={"Матч"}>
      <Header match={match} />
      <BigTabs<Tabs> items={items} selected={selected} flavor="small" />
      <br />
      {selected === "current" && <MatchGameCard game={currentGame} />}
      {selected === "games" && (
        <div className={c.games}>
          {match.games.map((game) => (
            <GamePreview key={game.id} game={game} />
          ))}
        </div>
      )}
    </GenericModal>
  );
};
