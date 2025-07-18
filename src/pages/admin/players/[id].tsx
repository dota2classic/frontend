import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  PlayerSummary,
  Section,
  Table,
  UserPreview,
} from "@/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NextPageContext } from "next";
import {
  ForumUserDto,
  PlayerSummaryDto,
  Role,
  RoleSubscriptionEntryDto,
  SmurfData,
  UpdatePlayerFlagDto,
} from "@/api/back";
import c from "./AdminPlayerPage.module.scss";
import c2 from "../AdminStyles.module.scss";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { RoleNames } from "@/const/roles";
import cx from "clsx";
import { fullDate } from "@/util/dates";
import { formatBanReason } from "@/util/texts/bans";
import { AdminPlayerBanSettings, GiveProductContainer } from "@/containers";

// const BanReasonOptions = [
//   BanReason.GAME_DECLINE,
//   BanReason.LOAD_FAILURE,
//   BanReason.INFINITE_BAN,
//   BanReason.ABANDON,
//   BanReason.RULE_VIOLATION,
// ].map((it) => ({ value: it, label: formatBanReason(it) }));

const TimeControlButtons = (p: {
  value: Date;
  onChange: (d: Date) => void;
}) => {
  const addDays = useCallback(
    (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      p.onChange(d);
    },
    [p.value],
  );

  const permaBan = useCallback(() => {
    const d = new Date();
    d.setFullYear(2048);
    p.onChange(d);
  }, []);

  return (
    <>
      <Button className="small" onClick={() => addDays(-2)}>
        Разбанить
      </Button>

      <Button className="small" onClick={() => addDays(1)}>
        +Сутки
      </Button>
      <Button className="small" onClick={() => addDays(7)}>
        +Неделя
      </Button>
      <Button className="small" onClick={permaBan}>
        Перма бан
      </Button>
    </>
  );
};

const RoleRow = (props: RoleSubscriptionEntryDto & { mutate: () => void }) => {
  const api = getApi().adminApi;

  const isExpired = new Date(props.endTime).getTime() < new Date().getTime();
  // const isExpired = false;

  const updateEndTime = (d: Date | null) => {
    if (!d) return;
    return api
      .adminUserControllerUpdateRole({
        steamId: props.steamId,
        role: props.role,
        endTime: d.getTime(),
      })
      .then(() => props.mutate());
  };

  const removeRole = () => {
    const d = new Date();

    d.setMonth(d.getMonth() - 2);
    return updateEndTime(d);
  };

  const addMonth = () => {
    const d = new Date(props.endTime);
    d.setMonth(d.getMonth() + 1);
    return updateEndTime(d);
  };

  return (
    <tr>
      <td className={`ROLE_${props.role}`}>{RoleNames[props.role]}</td>
      <td>
        <DatePicker
          customInputRef={""}
          dateFormat={"dd MMMM yyyy HH:mm"}
          customInput={
            isExpired ? (
              <Button className={"small"}>Назначить</Button>
            ) : (
              <Input className={cx("iso", c.banEndTime)} />
            )
          }
          selected={new Date(props.endTime)}
          onChange={updateEndTime}
        />
      </td>
      <td className={c.actions}>
        <Button className="small" onClick={removeRole}>
          Убрать роль
        </Button>
        <Button className="small" onClick={addMonth}>
          Добавить месяц
        </Button>
      </td>
    </tr>
  );
};

interface AdminPlayerPageProps {
  preloadedSummary: PlayerSummaryDto;
  preloadedForumUser: ForumUserDto;
  smurfData: SmurfData[];
}

export default function AdminPlayerPage({
  preloadedSummary,
  preloadedForumUser,
  smurfData,
}: AdminPlayerPageProps) {
  const { id } = useRouter().query;
  const steamId = id as string;

  // const reloadPageProps = useRefreshPageProps();

  // const [selectedBanReason, setSelectedBanReason] = useState<
  //   { value: BanReason; label: string } | undefined
  // >(
  //   BanReasonOptions.find(
  //     (t) =>
  //       t.value ===
  //       (preloadedBans.banStatus.isBanned
  //         ? preloadedBans.banStatus.status
  //         : undefined),
  //   ),
  // );

  const { data: flags, mutate: mutateFlags } =
    getApi().adminApi.useAdminUserControllerPlayerFlags(steamId);

  const updateFlag = useCallback(
    (p: UpdatePlayerFlagDto) => {
      getApi()
        .adminApi.adminUserControllerFlagPlayer(steamId, p)
        .then(mutateFlags);
    },
    [mutateFlags, steamId],
  );

  const { data: forumUser, mutate: mutateForumUser } =
    getApi().forumApi.useForumControllerGetUser(steamId, {
      fallbackData: preloadedForumUser,
    });

  const { data: roleData, mutate: mutateRoles } =
    getApi().adminApi.useAdminUserControllerRoleOf(steamId);

  const [combinedRoles, setCombinedRoles] = useState<
    RoleSubscriptionEntryDto[]
  >([]);

  const managedRoles: Role[] = [
    Role.OLD,
    Role.HUMAN,
    Role.MODERATOR,
    Role.ADMIN,
  ];

  useEffect(() => {
    const tmp: RoleSubscriptionEntryDto[] = [];
    if (roleData) {
      tmp.push(...roleData.entries);
    }
    managedRoles.forEach((t) => {
      if (tmp.find((z) => z.role === t)) {
        // if there is role, skip
      } else {
        const endTime = new Date();
        endTime.setDate(endTime.getDate() - 1);
        tmp.push({
          role: t,
          endTime: endTime.getTime(),
          steamId: steamId,
        });
      }
    });
    setCombinedRoles(tmp);
  }, [roleData, steamId]);

  const setMuteEndTime = useCallback((date: Date | null) => {
    getApi()
      .forumApi.forumControllerUpdateUser(preloadedForumUser.user.steamId, {
        muteUntil: date
          ? date.toISOString()
          : new Date(new Date().getTime() - 100000).toISOString(),
      })
      .then(() => mutateForumUser());
  }, []);

  const isBanActive = (endTime: Date | null) => {
    if (!endTime) return false;
    return endTime.getTime() > new Date().getTime();
  };

  const endMuteTime = new Date(forumUser!.mutedUntil);

  return (
    <div className={c2.gridPanel}>
      <PlayerSummary
        session={preloadedSummary.session}
        banStatus={preloadedSummary.banStatus}
        className={c2.grid12}
        stats={preloadedSummary.overallStats}
        user={preloadedSummary.user}
        rank={preloadedSummary.seasonStats.rank}
        mmr={preloadedSummary.seasonStats.mmr}
      />

      <Section className={c2.grid12}>
        <header>Флаги</header>
        <Table>
          <thead>
            <tr>
              <th>Флаг</th>
              <th>Включен</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Игнорировать алерты о смурф</td>
              <td>
                <Checkbox
                  onChange={(e) => updateFlag({ ignoreSmurf: e })}
                  checked={flags?.ignoreSmurf}
                />
              </td>
            </tr>

            <tr>
              <td>Запретить жалобы</td>
              <td>
                <Checkbox
                  onChange={(e) => updateFlag({ disableReports: e })}
                  checked={flags?.disableReports}
                />
              </td>
            </tr>

            <tr>
              <td>Запретить стримы</td>
              <td>
                <Checkbox
                  onChange={(e) => updateFlag({ disableStreams: e })}
                  checked={flags?.disableStreams}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <Section className={c2.grid12}>
        <header>Смурфы</header>
        <Table>
          <thead>
            <tr>
              <th>Аккаунт</th>
              <th>Статус бана</th>
            </tr>
          </thead>
          <tbody>
            {smurfData.map((smurf) => (
              <tr key={smurf.user.steamId}>
                <td>
                  <UserPreview avatarSize={30} user={smurf.user} />
                </td>
                {smurf.ban.isBanned ? (
                  <td>
                    {formatBanReason(smurf.ban.status)}{" "}
                    {fullDate(new Date(smurf.ban.bannedUntil))}
                  </td>
                ) : (
                  <td>Бана нет</td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section className={c2.grid12}>
        <header>Блокировка</header>
        <AdminPlayerBanSettings steamId={steamId} />
      </Section>

      <Section className={c2.grid12}>
        <header>Подписка</header>
        <GiveProductContainer steamId={steamId} />
      </Section>

      <Section className={c2.grid12}>
        <header>Роли</header>
        <Table>
          <thead>
            <tr>
              <th>Параметр/Роль</th>
              <th>Время окончания</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Мут на форуме</td>
              <td>
                <DatePicker
                  customInputRef={""}
                  showTimeSelect
                  timeIntervals={1}
                  dateFormat={"dd MMMM yyyy HH:mm"}
                  customInput={
                    <Input
                      placeholder={"Назначить"}
                      className={cx(
                        "iso",
                        c.banEndTime,
                        isBanActive(endMuteTime) ? c.active : c.inactive,
                      )}
                    />
                  }
                  selected={endMuteTime}
                  onChange={setMuteEndTime}
                />
              </td>
              <td className={c.actions}>
                <TimeControlButtons
                  value={endMuteTime}
                  onChange={setMuteEndTime}
                />
              </td>
            </tr>
            {combinedRoles
              .sort((a, b) => a.role.localeCompare(b.role))
              .map((z) => (
                <RoleRow key={z.role} {...z} mutate={mutateRoles} />
              ))}
          </tbody>
        </Table>
      </Section>
    </div>
  );
}

AdminPlayerPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<AdminPlayerPageProps> => {
  const playerId = ctx.query.id as string;

  const [preloadedSummary, preloadedForumUser, smurfData] =
    await Promise.combine([
      getApi().playerApi.playerControllerPlayerSummary(playerId),
      withTemporaryToken(ctx, () =>
        getApi().forumApi.forumControllerGetUser(playerId),
      ),
      withTemporaryToken(ctx, () =>
        getApi().adminApi.adminUserControllerSmurfOf(playerId),
      ),
    ]);

  return {
    preloadedSummary,
    preloadedForumUser,
    smurfData,
  };
};
