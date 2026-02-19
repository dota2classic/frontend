import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { TournamentDto, TournamentStatus } from "@/api/back";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import React from "react";
import c from "./TournamentStyles.module.scss";
import { TimeAgo } from "@/components/TimeAgo";
import { AppRouter } from "@/route";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { Duration } from "@/components/Duration";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { useRefreshPageProps } from "@/util/usePageProps";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";
import { NextPageContext } from "next";

interface Props {
  tournament: TournamentDto;
}

export default function TournamentAdminPage({ tournament }: Props) {
  const { t } = useTranslation();
  const refresh = useRefreshPageProps();

  const [isPublishing, publish] = useAsyncButton(async () => {
    try {
      await getApi().tournament.tournamentControllerPublishTournament(
        tournament.id,
      );
      await refresh();
    } catch (e) {
      await handleException("Ошибка при публикации турнира", e);
    }
  }, [tournament, refresh]);

  const [isFinishing, finish] = useAsyncButton(async () => {
    try {
      await getApi().tournament.tournamentControllerFinishTournament(
        tournament.id,
      );
      await refresh();
    } catch (e) {
      await handleException("Ошибка при завершении турнира", e);
    }
  }, [tournament, refresh]);

  const [isGeneratingBracket, generateBracket] = useAsyncButton(async () => {
    try {
      if (!confirm("Точно перегенерировать сетку? Это удалит все матчи")) {
        return;
      }
      await getApi().tournament.tournamentControllerStartTournament(
        tournament.id,
      );
      await refresh();
    } catch (e) {
      await handleException("Ошибка при завершении турнира", e);
    }
  }, [tournament, refresh]);

  const [isStartingReadyCheck, startReadyCheck] = useAsyncButton(async () => {
    try {
      await getApi().tournament.tournamentControllerEndRegistration(
        tournament.id,
      );
      await refresh();
    } catch (e) {
      await handleException("Ошибка смене статуса турнира", e);
    }
  }, []);
  return (
    <>
      <Breadcrumbs>
        <PageLink link={AppRouter.admin.tournament.index.link}>
          Турниры
        </PageLink>
        <span>{tournament.name}</span>
      </Breadcrumbs>
      <QueuePageBlock className={c.block} heading={"Информация о турнире"}>
        <div className={c.actions}>
          <Button
            className={c.inline}
            pageLink={AppRouter.admin.tournament.edit(tournament.id).link}
          >
            Редактировать
          </Button>
          {tournament.status === TournamentStatus.DRAFT && (
            <Button disabled={isPublishing} variant="primary" onClick={publish}>
              Опубликовать
            </Button>
          )}
          {tournament.status === TournamentStatus.INPROGRESS && (
            <Button disabled={isFinishing} variant="primary" onClick={finish}>
              Завершить
            </Button>
          )}

          {tournament.status === TournamentStatus.INPROGRESS && (
            <Button
              disabled={isGeneratingBracket}
              variant="primary"
              onClick={generateBracket}
            >
              (ОПАСНО) Перегенерировать сетку
            </Button>
          )}

          {tournament.status === TournamentStatus.REGISTRATION && (
            <Button
              disabled={isStartingReadyCheck}
              variant="primary"
              onClick={startReadyCheck}
            >
              Запустить проверку на готовность
            </Button>
          )}
          <Button
            className={c.inline}
            pageLink={AppRouter.admin.tournament.bracket(tournament.id).link}
          >
            Управление сеткой
          </Button>
        </div>
        <h2>Турнир "{tournament.name}"</h2>
        <h3>
          Статус:{" "}
          <span className="gold">
            {t(`tournament.status.${tournament.status}` as TranslationKey)}
          </span>
        </h3>
        <h3>
          Зарегистрировано:{" "}
          <span className="gold">
            {tournament.registrations.reduce((a, b) => a + b.players.length, 0)}{" "}
            игроков
          </span>
        </h3>
      </QueuePageBlock>
      <br />
      <br />
      <br />
      <QueuePageBlock className={c.block} heading={"Настройки сетки"}>
        <div className={c.options}>
          <dl>
            <dd>Игроков в команде</dd>
            <dt>{tournament.teamSize}</dt>
          </dl>
          <dl>
            <dd>Старт турнира</dd>
            <dt>
              <TimeAgo date={tournament.startDate} />
            </dt>
          </dl>
          <dl>
            <dd>Вид сетки</dd>
            <dt>{tournament.strategy}</dt>
          </dl>
          <dl>
            <dd>Игровой режим</dd>
            <dt>{t(`game_mode.${tournament.gameMode}` as TranslationKey)}</dt>
          </dl>
          <dl>
            <dd>Длительность игры</dd>
            <dt>
              <Duration
                duration={tournament.scheduleStrategy.gameDurationSeconds}
              />
            </dt>
          </dl>
          <dl>
            <dd>Длительность перерыва</dd>
            <dt>
              <Duration
                duration={tournament.scheduleStrategy.gameBreakDurationSeconds}
              />
            </dt>
          </dl>
          <dl>
            <dd>Количество игр в раундах</dd>
            <dt>{tournament.bestOfConfig.round}</dt>
          </dl>
          <dl>
            <dd>Количество игр в финале</dd>
            <dt>{tournament.bestOfConfig._final}</dt>
          </dl>
          <dl>
            <dd>Количество игр в гранд финале</dd>
            <dt>{tournament.bestOfConfig.grandFinal}</dt>
          </dl>
          <dl>
            <dd>Руны</dd>
            <dt>{tournament.disableRunes ? "Выключены" : "Включены"}</dt>
          </dl>
          <dl>
            <dd>Лимит по киллам</dd>
            <dt>{tournament.killsToWin || "-"}</dt>
          </dl>
          <dl>
            <dd>Режим "midonly"</dd>
            <dt>{tournament.midTowerToWin ? "Включен" : "-"}</dt>
          </dl>
          <dl>
            <dd>Стадия банов</dd>
            <dt>{tournament.enableBanStage ? "Включена" : "-"}</dt>
          </dl>
        </div>
      </QueuePageBlock>
    </>
  );
}

TournamentAdminPage.getInitialProps = async (ctx: NextPageContext) => {
  const id = Number(ctx.query.id as string);

  return {
    tournament: await withTemporaryToken(ctx, () =>
      getApi().tournament.tournamentControllerGetTournament(id),
    ),
  };
};
