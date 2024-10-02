import { useApi } from "@/api/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Input, PlayerSummary, Table } from "@/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NextPageContext } from "next";
import { PlayerSummaryDto, UserBanSummaryDto } from "@/api/back";
import c from "./AdminPlayerPage.module.scss";
import { withTemporaryToken } from "@/util/withTemporaryToken";

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

  const { data, mutate } = useApi().adminApi.useAdminUserControllerBanOf(
    steamId,
    {
      fallbackData: preloadedBans,
    },
  );

  const [endTime, setEndTime] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );

  const api = useApi().adminApi;

  const commitChanges = (d: Date) => {
    return api
      .adminUserControllerBanId(steamId, {
        endTime: d.getTime(),
      })
      .then(() => mutate());
  };
  useEffect(() => {
    if (data) {
      setEndTime(new Date(data.banStatus.bannedUntil));
    }
  }, [data]);

  const isBanActive = endTime.getTime() < new Date().getTime();

  return (
    <>
      <PlayerSummary
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rank={preloadedSummary.rank}
        mmr={preloadedSummary.mmr}
        image={preloadedSummary.user.avatar || "/avatar.png"}
        name={preloadedSummary.user.name}
        steamId={preloadedSummary.user.steamId}
      />
      <Table>
        <thead>
          <tr>
            <th>Время окончания</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {isBanActive ? (
                <DatePicker
                  customInputRef={""}
                  showTimeSelect
                  locale={"ru-RU"}
                  dateFormat={"dd MMMM yyyy"}
                  customInput={<Button className={"small"}>Назначить</Button>}
                  selected={endTime}
                  onChange={(date: Date) => {
                    setEndTime(date);
                    return commitChanges(date);
                  }}
                />
              ) : (
                <DatePicker
                  customInputRef={""}
                  showTimeSelect
                  locale={"ru-RU"}
                  dateFormat={"dd MMMM yyyy"}
                  customInput={<Input className={"iso"} />}
                  selected={endTime}
                  onChange={(date: Date) => {
                    setEndTime(date);
                    return commitChanges(date);
                  }}
                />
              )}
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
                onClick={() => {
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
                onClick={() => {
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
          </tr>
        </tbody>
      </Table>
    </>
  );
}

AdminPlayerPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<AdminPlayerPageProps> => {
  const playerId = ctx.query.id as string;

  const [preloadedSummary, preloadedBans] = await Promise.all<any>([
    useApi().playerApi.playerControllerPlayerSummary(playerId),
    withTemporaryToken(ctx, () =>
      useApi().adminApi.adminUserControllerBanOf(playerId),
    ),
  ]);

  return {
    preloadedSummary,
    preloadedBans,
  };
};
