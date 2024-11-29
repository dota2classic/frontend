import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  PlayerSummary,
  Section,
  SelectOptions,
  Table,
} from "@/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NextPageContext } from "next";
import {
  BanReason,
  PlayerSummaryDto,
  Role,
  RoleSubscriptionEntryDto,
  UserBanSummaryDto,
} from "@/api/back";
import c from "./AdminPlayerPage.module.scss";
import c2 from "../AdminStyles.module.scss";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { RoleNames } from "@/const/roles";
import cx from "clsx";
import { usePeriodicRefresh } from "@/util/usePeriodicRefresh";

const BanReasonOptions = [
  {
    value: BanReason.GAME_DECLINE,
    label: "Отклонение игр",
  },
  {
    value: BanReason.LOAD_FAILURE,
    label: "Не загружается в игры",
  },
  {
    value: BanReason.INFINITE_BAN,
    label: "Пермабан",
  },
  {
    value: BanReason.REPORTS,
    label: "Репорты",
  },
  {
    value: BanReason.ABANDON,
    label: "Покидание игр",
  },
  {
    value: BanReason.LEARN2PLAY,
    label: "Учись играть",
  },
];

const RoleRow = (props: RoleSubscriptionEntryDto) => {
  const [endTime, setEndTime] = useState(new Date(props.endTime));
  const api = getApi().adminApi;

  const isExpired = endTime.getTime() < new Date().getTime();

  const commitChanges = (d: Date | null) => {
    if (!d) return;
    return api.adminUserControllerUpdateRole({
      steamId: props.steamId,
      role: props.role,
      endTime: d.getTime(),
    });
  };

  const removeRole = () => {
    const d = new Date();

    d.setMonth(d.getMonth() - 2);
    setEndTime(d);
    return commitChanges(d);
  };

  const addMonth = () => {
    const d = new Date(endTime);
    d.setMonth(endTime.getMonth() + 1);
    setEndTime(d);
    return commitChanges(d);
  };

  return (
    <tr>
      <td className={`ROLE_${props.role}`}>{RoleNames[props.role]}</td>
      <td>
        {isExpired ? (
          <DatePicker
            customInputRef={""}
            dateFormat={"dd MMMM yyyy hh:ss"}
            customInput={<Button className={"small"}>Назначить</Button>}
            selected={endTime}
            onChange={(date: Date | null) => {
              if (!date) return;
              setEndTime(date);
              return commitChanges(date);
            }}
          />
        ) : (
          <DatePicker
            customInputRef={""}
            dateFormat={"dd MMMM yyyy hh:ss"}
            customInput={<Input className={cx("iso", c.banEndTime)} />}
            selected={endTime}
            onChange={(date: Date | null) => {
              if (!date) return;
              setEndTime(date);
              return commitChanges(date);
            }}
          />
        )}
      </td>
      <td>
        <Button className="small" onClick={removeRole}>
          Убрать роль
        </Button>
        <span style={{ marginLeft: 10 }} />
        <Button className="small" onClick={addMonth}>
          Добавить месяц
        </Button>
      </td>
    </tr>
  );
};

interface AdminPlayerPageProps {
  preloadedSummary: PlayerSummaryDto;
  preloadedBans: UserBanSummaryDto;
}

export default function AdminPlayerPage({
  preloadedBans,
  preloadedSummary,
}: AdminPlayerPageProps) {
  const { id } = useRouter().query;
  const steamId = id as string;

  const [selectedBanReason, setSelectedBanReason] = useState<
    { value: BanReason; label: string } | undefined
  >(
    BanReasonOptions.find(
      (t) =>
        t.value ===
        (preloadedBans.banStatus.isBanned
          ? preloadedBans.banStatus.status
          : undefined),
    ),
  );

  console.log(selectedBanReason);
  const { data, mutate } = getApi().adminApi.useAdminUserControllerBanOf(
    steamId,
    {
      fallbackData: preloadedBans,
    },
  );

  const { data: roleData } =
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

  const [endTime, setEndTime] = useState<Date | null>(null);

  const api = getApi().adminApi;

  const commitChanges = (d: Date) => {
    console.log(selectedBanReason);
    return api
      .adminUserControllerBanId(steamId, {
        endTime: d.toISOString(),
        reason: selectedBanReason
          ? selectedBanReason.value
          : BanReason.INFINITE_BAN,
      })
      .then(() => mutate());
  };
  useEffect(() => {
    if (data) {
      setEndTime(new Date(data.banStatus.bannedUntil));
    }
  }, [data]);

  const isBanActive = usePeriodicRefresh<boolean>(
    () => {
      return endTime ? endTime.getTime() > new Date().getTime() : false;
    },
    1000,
    [endTime],
  );

  console.log("Ban active?", isBanActive);

  return (
    <div className={c2.gridPanel}>
      <PlayerSummary
        className={c2.grid12}
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rank={preloadedSummary.rank}
        mmr={preloadedSummary.mmr}
        image={preloadedSummary.user.avatar || "/avatar.png"}
        name={preloadedSummary.user.name}
        steamId={preloadedSummary.user.steamId}
      />

      <Section className={c2.grid12}>
        <header>Роли и баны</header>
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
              <td>Бан</td>
              <td>
                <DatePicker
                  customInputRef={""}
                  showTimeSelect
                  timeIntervals={1}
                  dateFormat={"dd MMMM yyyy hh:mm"}
                  customInput={
                    <Input
                      placeholder={"Назначить"}
                      className={cx(
                        "iso",
                        c.banEndTime,
                        isBanActive ? c.active : c.inactive,
                      )}
                    />
                  }
                  selected={endTime}
                  onChange={(date: Date | null) => {
                    if (!date) return;
                    setEndTime(date);
                    return commitChanges(date);
                  }}
                />
              </td>

              <td className={c.actions}>
                <Button
                  className="small"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 2);
                    setEndTime(d);
                    return commitChanges(d);
                  }}
                >
                  Разбанить
                </Button>

                <Button
                  className="small"
                  disabled={!endTime}
                  onClick={() => {
                    if (!endTime) return;
                    const d = new Date(endTime.getTime());
                    d.setDate(d.getDate() + 1);
                    setEndTime(d);
                    return commitChanges(d);
                  }}
                >
                  +Сутки
                </Button>
                <Button
                  className="small"
                  disabled={!endTime}
                  onClick={() => {
                    if (!endTime) return;
                    const d = new Date(endTime.getTime());
                    d.setDate(d.getDate() + 7);
                    setEndTime(d);
                    return commitChanges(d);
                  }}
                >
                  +Неделя
                </Button>
                <Button
                  className="small"
                  onClick={() => {
                    const d = new Date();
                    d.setFullYear(2048);
                    setEndTime(d);
                    return commitChanges(d);
                  }}
                >
                  Перма бан
                </Button>
              </td>
              <td>
                <SelectOptions
                  defaultValue={BanReasonOptions.find(
                    (t) => t.value === preloadedBans?.banStatus.status,
                  )}
                  options={BanReasonOptions}
                  selected={selectedBanReason}
                  onSelect={setSelectedBanReason}
                  defaultText={"Причина бана"}
                />
              </td>
            </tr>
            {combinedRoles
              .sort((a, b) => a.role.localeCompare(b.role))
              .map((z) => (
                <RoleRow key={z.role} {...z} />
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

  const [preloadedSummary, preloadedBans] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    withTemporaryToken(ctx, () =>
      getApi().adminApi.adminUserControllerBanOf(playerId),
    ),
  ]);

  return {
    preloadedSummary,
    preloadedBans,
  };
};
