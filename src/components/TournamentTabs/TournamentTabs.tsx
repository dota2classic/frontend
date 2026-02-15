import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "react-i18next";
import { AppRouter, NextLinkProp } from "@/route";
import { BigTabs, IBigTabsProps } from "@/components/BigTabs/BigTabs";
import { TranslationKey } from "@/TranslationKey";
import c from "./TournamentTabs.module.scss";
import {
  RegistrationDtoStateEnum,
  RegistrationPlayerDtoStateEnum,
  TournamentDto,
  TournamentStatus,
} from "@/api/back";
import { TimeAgo } from "@/components/TimeAgo";
import { Badge } from "@/components/Badge";
import { TrajanPro } from "@/const/fonts";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { TournamentRegisterModal } from "@/containers/TournamentRegisterModal";
import { useAsyncButton } from "@/util/use-async-button";
import { getApi } from "@/api/hooks";
import { handleException } from "@/util/handleException";
import { useRefreshPageProps } from "@/util/usePageProps";
import { CountdownClient } from "@/components/PeriodicTimer";
import { makeSimpleToast } from "@/components/Toast";
import { TournamentStatusBadge } from "@/components/TournamentStatusBadge";
import { getAuthUrl } from "@/util/getAuthUrl";

type Tabs = "overview" | "bracket" | "matches" | "registered" | "results";

type Items = IBigTabsProps<Tabs, TranslationKey>["items"];

const getMenuItems = (id: number): Items => {
  const menuItems: Items = [
    {
      key: "overview",
      label: "tournament.tabs.overall",
      onSelect: AppRouter.tournament.tournament(id).link,
    },
    {
      key: "bracket",
      label: "tournament.tabs.bracket",
      onSelect: AppRouter.tournament.bracket(id).link,
    },
    {
      key: "matches",
      label: "tournament.tabs.matches",
      onSelect: AppRouter.tournament.matches(id).link,
    },
    {
      key: "registered",
      label: "tournament.tabs.registered",
      onSelect: AppRouter.tournament.participants(id).link,
    },
    {
      key: "results",
      label: "tournament.tabs.results",
      onSelect: AppRouter.tournament.results(id).link,
    },
  ];

  return menuItems;
};

interface ITournamentTabsProps {
  tournament: TournamentDto;
}

export const TournamentTabs: React.FC<ITournamentTabsProps> = observer(
  ({ tournament }) => {
    const items = useMemo<Items>(
      () => getMenuItems(tournament.id),
      [tournament.id],
    );
    const [registerOpen, setRegisterOpen] = useState(false);
    const { isAuthorized } = useStore().auth;

    const refreshPageProps = useRefreshPageProps();

    const r = useRouter();
    const { t } = useTranslation();

    const selected = useMemo(
      () =>
        items.find(
          (t) => (t.onSelect as NextLinkProp).as === r.asPath.split("?")[0],
        ),
      [items, r],
    );

    const pt = useStore().auth.parsedToken;
    const registration = useMemo(
      () =>
        tournament.registrations.find(
          (reg) =>
            reg.players.findIndex((plr) => plr.user.steamId === pt?.sub) !== -1,
        ),
      [tournament, pt],
    );

    const myRegistration = useMemo(() => {
      return (
        registration &&
        registration.players.find((t) => t.user.steamId === pt?.sub)
      );
    }, [registration, pt]);

    const hasStarted =
      tournament.status === TournamentStatus.INPROGRESS ||
      tournament.status === TournamentStatus.FINISHED;

    const leaveRegistration = useCallback(async () => {
      try {
        await getApi().tournament.tournamentControllerUnregister(tournament.id);
        await refreshPageProps();
        makeSimpleToast("Успех", "Ты больше не участвуешь в турнире", 5000);
      } catch (e) {
        await handleException("Ошибка при изменении регистрации", e);
      }
    }, [refreshPageProps, tournament.id]);

    const [isConfirming, confirmReadyCheck] = useAsyncButton(async () => {
      try {
        await getApi().tournament.tournamentControllerConfirmRegistration(
          tournament.id,
          { confirm: true },
        );
        await refreshPageProps();
      } catch (e) {
        await handleException("Ошибка при подтверждении готовности", e);
      }
    }, [tournament, refreshPageProps]);

    const canJoinOrLeave =
      tournament.status === TournamentStatus.REGISTRATION ||
      tournament.status === TournamentStatus.READYCHECK;

    return (
      <div className={c.container}>
        {registerOpen && (
          <TournamentRegisterModal
            tournament={tournament}
            onClose={() => setRegisterOpen(false)}
            onRegister={refreshPageProps}
          />
        )}
        <div className={cx(c.header, NotoSans.className)}>
          <div className={c.bg} />
          <div className={c.bgMask} />
          <img loading={"lazy"} src={tournament.imageUrl} alt="" />
          <div className={c.header__right}>
            <div className={c.overview}>
              <h1 className={cx(TrajanPro.className, c.title)}>
                {tournament.name}
              </h1>
              <span className={c.timestamp}>
                <span>
                  <Trans
                    i18nKey="tournament.common.starts"
                    components={{
                      time: <TimeAgo date={tournament.startDate} />,
                    }}
                  />
                </span>
                <span className={c.delimeter}>•</span>
                <TournamentStatusBadge status={tournament.status} />
              </span>
            </div>
          </div>
          <div className={c.actions}>
            {!hasStarted &&
              new Date(tournament.startDate).getDate() ===
                new Date().getDate() && (
                <>
                  Начало через <CountdownClient until={tournament.startDate} />
                </>
              )}

            {registration && !hasStarted && canJoinOrLeave && (
              <Button onClick={leaveRegistration}>Отказаться от участия</Button>
            )}
            {!registration && !hasStarted && canJoinOrLeave && (
              <Button
                onClick={() => isAuthorized && setRegisterOpen(true)}
                variant="primary"
                link={!isAuthorized}
                href={isAuthorized ? undefined : getAuthUrl()}
              >
                {t("tournament.common.join")}
              </Button>
            )}
            {myRegistration &&
              !hasStarted &&
              myRegistration.state ===
                RegistrationPlayerDtoStateEnum.PENDINGCONFIRMATION && (
                <Button
                  disabled={isConfirming}
                  onClick={confirmReadyCheck}
                  variant="primary"
                >
                  {t("tournament.common.confirmReady")}
                </Button>
              )}

            {myRegistration &&
              !hasStarted &&
              myRegistration.state ===
                RegistrationPlayerDtoStateEnum.CONFIRMED && (
                <Badge variant="green">{t("tournament.common.ready")}</Badge>
              )}
            {registration &&
              !hasStarted &&
              registration.state ===
                RegistrationDtoStateEnum.PENDINGCONFIRMATION && (
                <Badge variant="yellow">
                  {t("tournament.common.notAllReady")}
                </Badge>
              )}
          </div>
        </div>
        <BigTabs<Tabs>
          className={c.tabs}
          flavor="small"
          items={items.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
          selected={selected?.key || "overview"}
        />
      </div>
    );
  },
);
