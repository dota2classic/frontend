import React from "react";

import c from "./TournamentCard.module.scss";
import { AppRouter } from "@/route";
import { PageLink } from "@/components/PageLink";
import { TournamentDto } from "@/api/back";
import { TimeAgo } from "@/components/TimeAgo";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TournamentStatusBadge } from "@/components/TournamentStatusBadge";

interface ITournamentCardProps {
  tournament: TournamentDto;
}

export const TournamentCard: React.FC<ITournamentCardProps> = ({
  tournament,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cx(c.card, NotoSans.className)}>
      <img src={tournament.imageUrl || "/avatar.png"} alt="" />
      <div className={c.info}>
        <h2>
          <PageLink
            className={"link"}
            link={AppRouter.tournament.tournament(tournament.id).link}
          >
            {tournament.name}
          </PageLink>
        </h2>
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
              <TimeAgo pretty date={tournament.startDate} />
            </dt>
          </dl>
          <dl>
            <dd>Статус</dd>
            <dt>
              <TournamentStatusBadge status={tournament.status} />
            </dt>
          </dl>
        </div>
      </div>
    </div>
  );
};
