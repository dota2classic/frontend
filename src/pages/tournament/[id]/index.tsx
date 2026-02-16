import {
  RegistrationPlayerDtoStateEnum,
  TournamentDto,
  UserDTO,
} from "@/api/back";
import { getApi } from "@/api/hooks";
import React, { useCallback, useMemo, useState } from "react";
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
import { EmbedProps } from "@/components/EmbedProps";
import { usePeriodicRefreshPageProps } from "@/util/usePageProps";
import { RegistrationCard } from "@/components/RegistrationCard";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { InvitePlayerModalRaw } from "@/components/InvitePlayerModal";
import { handleException } from "@/util/handleException";
import { makeSimpleToast } from "@/components/Toast";

interface Props {
  id: number;
  tournament: TournamentDto;
}

export default function TournamentPage({ tournament }: Props) {
  const { t } = useTranslation();
  const readyCheckStart =
    new Date(tournament.startDate).getTime() - 1000 * 60 * 60;
  const [inviteVisible, setInviteVisible] = useState(false);

  usePeriodicRefreshPageProps(30_000);

  const pt = useStore().auth.parsedToken;
  const registration = useMemo(
    () =>
      tournament.registrations.find(
        (reg) =>
          reg.players.findIndex((plr) => plr.user.steamId === pt?.sub) !== -1,
      ),
    [tournament, pt],
  );

  const invitePlayer = useCallback(
    async (user: UserDTO) => {
      try {
        await getApi().tournament.tournamentControllerInviteToRegistration(
          tournament.id,
          {
            steamId: user.steamId,
          },
        );
        setInviteVisible(false);
        makeSimpleToast(
          "Приглашение отправлено",
          "Когда игрок на него ответит, ты получишь уведомление",
        );
      } catch (e) {
        await handleException("Ошибка приглашения", e);
      }
    },
    [tournament.id, setInviteVisible],
  );

  return (
    <div>
      <EmbedProps
        title={t("tournament.seo.info.title", { name: tournament.name })}
        description={t("tournament.seo.info.description", {
          name: tournament.name,
        })}
      />
      {inviteVisible && (
        <InvitePlayerModalRaw
          onSelect={invitePlayer}
          close={() => setInviteVisible(false)}
        />
      )}
      <TournamentTabs tournament={tournament} />
      <div className={cx(c.container, NotoSans.className)}>
        <div className={c.main_info}>
          <QueuePageBlock simple heading={t("tournament.common.format")}>
            <div className={c.format}>
              <InfoCardWithIcon
                icon={<TbTournament />}
                title={t("tournament.common.format")}
                text={
                  <>
                    {t(
                      `tournament.bracket.${tournament.strategy}` as TranslationKey,
                    )}
                    ,{" "}
                    <span className="gold">
                      {t(`game_mode.${tournament.gameMode}` as TranslationKey)}
                    </span>
                  </>
                }
              />
              <InfoCardWithIcon
                icon={<FaCalendarDays />}
                title={t("tournament.common.readyWindow")}
                text={
                  <>
                    <TimeAgo pretty date={readyCheckStart} /> -{" "}
                    <TimeAgo pretty date={tournament.startDate} />
                  </>
                }
              />
              <InfoCardWithIcon
                icon={<RiTeamFill />}
                title={t("tournament.common.teamSize")}
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
                title={t("tournament.common.prize")}
                text={tournament.prize || t("tournament.common.notSet")}
              />
            </div>
          </QueuePageBlock>
          <QueuePageBlock heading={"Описание"}>
            <div className={c.description}>
              <p>{tournament.description}</p>
            </div>
          </QueuePageBlock>
        </div>
        <div className={c.side_info}>
          {registration && (
            <QueuePageBlock simple heading="Твоя команда">
              <RegistrationCard registration={registration} />
              <Button
                variant="primary"
                disabled={registration.players.length >= tournament.teamSize}
                onClick={() => setInviteVisible(true)}
              >
                Пригласить
              </Button>
            </QueuePageBlock>
          )}
          <QueuePageBlock simple heading={t("tournament.common.teams")}>
            <div className={c.register_card}>
              <dl>
                <dd>{t("tournament.common.registered")}</dd>
                <dt>
                  {tournament.registrations.reduce(
                    (a, b) => a + b.players.length,
                    0,
                  )}
                </dt>
              </dl>
              <dl>
                <dd>{t("tournament.common.ready")}</dd>
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
              {/*<dl>*/}
              {/*  <dd>{t("tournament.common.slots")}</dd>*/}
              {/*  <dt>8</dt>*/}
              {/*</dl>*/}
            </div>
          </QueuePageBlock>
          <QueuePageBlock simple heading={t("tournament.common.schedule")}>
            <Timeline
              className={c.timeline}
              items={[
                {
                  time: new Date(readyCheckStart),
                  title: t("tournament.timeline.readyCheckStart.title"),
                  content: t("tournament.timeline.readyCheckStart.content"),
                },
                {
                  time: new Date(tournament.startDate),
                  title: t("tournament.timeline.readyCheckEnd.title"),
                  content: t("tournament.timeline.readyCheckEnd.content"),
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
