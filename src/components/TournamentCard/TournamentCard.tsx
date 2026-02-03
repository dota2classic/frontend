import React from "react";

import c from "./TournamentCard.module.scss";
import { AppRouter } from "@/route";
import { PageLink } from "@/components/PageLink";
import { TournamentDto } from "@/api/back";
import { TimeAgo } from "@/components/TimeAgo";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";

interface ITournamentCardProps {
  tournament: TournamentDto;
}

export const TournamentCard: React.FC<ITournamentCardProps> = ({
  tournament,
}) => {
  const { t } = useTranslation();

  return (
    <div className={c.card}>
      <img src={tournament.imageUrl || "/avatar.png"} alt="" />
      <div className={c.info}>
        <h3>
          <PageLink
            className={"link"}
            link={AppRouter.tournament.tournament(tournament.id).link}
          >
            {tournament.name}
          </PageLink>
        </h3>
        <p>{tournament.description}</p>
        <div className={c.config}>
          <dl>
            <dd>Формат</dd>
            <dt>
              {tournament.teamSize}x{tournament.teamSize}
            </dt>
          </dl>
          <dl>
            <dd>Игровой режим</dd>
            <dt>{t(`game_mode.${tournament.gameMode}` as TranslationKey)}</dt>
          </dl>
          <dl>
            <dd>Начало турнира</dd>
            <dt>
              <TimeAgo date={tournament.startDate} />
            </dt>
          </dl>
          <dl>
            <dd>Статус</dd>
            <dt>
              {t(`tournament.status.${tournament.status}` as TranslationKey)}
            </dt>
          </dl>
        </div>
      </div>
    </div>
  );
};
