import { RegistrationPlayerDtoStateEnum, TournamentDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import React from "react";
import { TournamentTabs } from "@/components/TournamentTabs";
import c from "./TournamentStyles.module.scss";
import { Trans, useTranslation } from "react-i18next";
import { InfoCardWithIcon } from "@/components/InfoCardWithIcon";
import { TbTournament } from "react-icons/tb";
import { FaCalendarDays } from "react-icons/fa6";
import { TimeAgo } from "@/components/TimeAgo";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TranslationKey } from "@/TranslationKey";
import { FaTrophy } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { Timeline } from "@/components/Timeline";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { NextPageContext } from "next";

interface Props {
  id: number;
  tournament: TournamentDto;
}

export default function TournamentPage({ tournament }: Props) {
  const { t } = useTranslation();
  const readyCheckStart =
    new Date(tournament.startDate).getTime() - 1000 * 60 * 60;

  return (
    <div>
      <TournamentTabs tournament={tournament} />
      <div className={cx(c.container, NotoSans.className)}>
        <div className={c.main_info}>
          <QueuePageBlock simple heading="Формат">
            <div className={c.format}>
              <InfoCardWithIcon
                icon={<TbTournament />}
                title={"Формат"}
                text={t(
                  `tournament.bracket.${tournament.strategy}` as TranslationKey,
                )}
              />
              <InfoCardWithIcon
                icon={<FaCalendarDays />}
                title={"Окно готовности"}
                text={
                  <>
                    <TimeAgo pretty date={readyCheckStart} /> -{" "}
                    <TimeAgo pretty date={tournament.startDate} />
                  </>
                }
              />
              <InfoCardWithIcon
                icon={<RiTeamFill />}
                title={"Размер команды"}
                text={
                  <Trans
                    i18nKey="tournament.versus"
                    values={{
                      cnt: tournament.teamSize,
                    }}
                  />
                }
              />
              <InfoCardWithIcon
                icon={<FaTrophy />}
                title={"Приз"}
                text={tournament.prize || "Не указан"}
              />
            </div>
          </QueuePageBlock>
        </div>
        <div className={c.side_info}>
          <QueuePageBlock simple heading={"Команды"}>
            <div className={c.register_card}>
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
                <dd>Готовы</dd>
                <dt>
                  {" "}
                  {tournament.registrations.reduce(
                    (a, b) =>
                      a +
                      b.players.filter(
                        (t) =>
                          t.state === RegistrationPlayerDtoStateEnum.CONFIRMED,
                      ).length,
                    0,
                  )}
                </dt>
              </dl>
              <dl>
                <dd>Слотов</dd>
                <dt>8</dt>
              </dl>
            </div>
          </QueuePageBlock>
          <QueuePageBlock simple heading={"График"}>
            <Timeline
              className={c.timeline}
              items={[
                {
                  time: new Date(readyCheckStart),
                  content: "Начало проверки на готовность",
                  title: "Проверка на готовность",
                },
                {
                  time: new Date(tournament.startDate),
                  content: "Готовые игроки становятся участниками",
                  title: "Начало турнира",
                },
              ]}
            />
          </QueuePageBlock>
        </div>
      </div>
    </div>
  );
}

TournamentPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  return {
    id,
    tournament: await getApi().tournament.tournamentControllerGetTournament(id),
  };
};
