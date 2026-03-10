import React from "react";

import c from "./TournamentCard.module.scss";
import { AppRouter, NextLinkProp } from "@/route";
import { PageLink } from "@/components/PageLink";
import { TournamentDto } from "@/api/back";
import { TimeAgo } from "@/components/TimeAgo";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TournamentStatusBadge } from "@/components/TournamentStatusBadge";
import { TrajanPro } from "@/const/fonts";

interface ITournamentCardProps {
  tournament: TournamentDto;
  link?: NextLinkProp;
}

export const TournamentCard: React.FC<ITournamentCardProps> = ({
  tournament,
  link,
}) => {
  const { t } = useTranslation();
  const cardLink = link ?? AppRouter.tournament.tournament(tournament.id).link;

  return (
    <PageLink link={cardLink} className={cx(c.card, NotoSans.className)}>
      <img src={tournament.imageUrl || "/avatar.png"} alt="" />
      <div className={c.info}>
        <h2 className={TrajanPro.className}>{tournament.name}</h2>
        <p>{tournament.description}</p>
        <div className={c.config}>
          <dl>
            <dd>Формат</dd>
            <dt>
              {tournament.teamSize}x{tournament.teamSize},{" "}
              {t(`game_mode.${tournament.gameMode}` as TranslationKey)}
            </dt>
          </dl>
          <dl>
            <dd>Начало турнира</dd>
            <dt>
              <TimeAgo pretty date={tournament.startDate} />
            </dt>
          </dl>
          <dl>
            <dd>Регистраций</dd>
            <dt>
              {tournament.registrations.reduce(
                (a, b) => a + b.players.length,
                0,
              )}
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
    </PageLink>
  );
};
