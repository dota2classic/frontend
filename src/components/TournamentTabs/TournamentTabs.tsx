import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
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
import { BadgeVariant } from "@/components/Badge/Badge";
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

type Tabs = "overview" | "bracket" | "matches" | "registered";

type Items = IBigTabsProps<Tabs, TranslationKey>["items"];

const StatusMapping: Record<TournamentStatus, BadgeVariant> = {
  [TournamentStatus.DRAFT]: "grey",
  [TournamentStatus.FINISHED]: "grey",
  [TournamentStatus.INPROGRESS]: "green",
  [TournamentStatus.READYCHECK]: "yellow",
  [TournamentStatus.REGISTRATION]: "blue",
};

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

    const hasStarted = tournament.status === TournamentStatus.INPROGRESS;

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
          <img loading={"lazy"} src={tournament.imageUrl} alt="" />
          <div className={c.header__right}>
            <div className={c.overview}>
              <h1 className={TrajanPro.className}>{tournament.name}</h1>
              <span className={c.timestamp}>
                <span>
                  Начало: <TimeAgo date={tournament.startDate} />
                </span>
                <span className={c.delimeter}>•</span>
                <Badge
                  className={c.badge}
                  variant={StatusMapping[tournament.status]}
                >
                  {t(
                    `tournament.status.${tournament.status}` as TranslationKey,
                  )}
                </Badge>
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
              <Button onClick={() => setRegisterOpen(true)} variant="primary">
                Участвовать
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
                  Подвердить готовность
                </Button>
              )}

            {myRegistration &&
              !hasStarted &&
              myRegistration.state ===
                RegistrationPlayerDtoStateEnum.CONFIRMED && (
                <Badge variant="green">Готовность подтверждена</Badge>
              )}
            {registration &&
              !hasStarted &&
              registration.state ===
                RegistrationDtoStateEnum.PENDINGCONFIRMATION && (
                <Badge variant="yellow">Не все в группе готовы</Badge>
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
