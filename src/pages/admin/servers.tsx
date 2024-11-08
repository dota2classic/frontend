import { appApi, getApi } from "@/api/hooks";
import { Button, GenericTable, Table } from "@/components";
import { formatGameMode } from "@/util/gamemode";
import { Dota2Version, GameSessionDto, MatchmakingInfo } from "@/api/back";
import React, { useCallback } from "react";
import { ColumnType } from "@/components/GenericTable/GenericTable";

// todo: this is a big mess and we need to fix api generation
export default function AdminServersPage() {
  const { data: serverPool } =
    getApi().adminApi.useServerControllerServerPool();
  const { data: liveSessions, mutate: mutateLiveSessions } =
    getApi().adminApi.useServerControllerLiveSessions();

  const { data: allowedModes, mutate } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo();

  const modes = (allowedModes || ([] as MatchmakingInfo[]))
    .sort((a, b) => a.mode - b.mode)
    .filter((it) => it.version === Dota2Version.Dota_684);

  const sessions: GameSessionDto[] = liveSessions || [];

  const stopGameSession = useCallback(async (it: GameSessionDto) => {
    await appApi.adminApi.serverControllerStopServer({ url: it.url });
  }, []);
  return (
    <>
      <h3>Режимы игры</h3>

      <Table>
        <thead>
          <tr>
            <th>Версия</th>
            <th>Режим</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {modes.map((t) => (
            <tr key={t.version.toString() + t.mode.toString()}>
              <td>{t.version}</td>
              <td>{formatGameMode(t.mode)}</td>
              <td>
                <input
                  onChange={(e) => {
                    appApi.adminApi
                      .adminUserControllerUpdateGameMode({
                        mode: t.mode,
                        version: t.version,
                        enabled: e.target.checked,
                      })
                      .then(() => mutate());
                  }}
                  type="checkbox"
                  checked={t.enabled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Пул серверов</h3>

      <Table>
        <thead>
          <tr>
            <th>Ссылка</th>
            <th>Версия игры</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {serverPool?.map((it) => (
            <tr key={it.url}>
              <td>{it.url}</td>
              <td>{it.version}</td>
              <td>
                <button
                  className="small"
                  onClick={async () => {
                    await appApi.adminApi.serverControllerStopServer({
                      url: it.url,
                    });
                    await mutateLiveSessions();
                  }}
                >
                  Остановить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Текущие сессии</h3>

      <GenericTable
        keyProvider={(t) => t[1]}
        columns={[
          {
            type: ColumnType.ExternalLink,
            name: "Ссылка",
          },
          {
            type: ColumnType.Raw,
            name: "ID Матча",
          },
          {
            type: ColumnType.Raw,
            name: "Режим",
            format: (t) => formatGameMode(t),
          },
          {
            type: ColumnType.Raw,
            name: "Команды",
          },
          {
            type: ColumnType.Raw,
            name: "Действия",
            format: (d) => (
              <>
                <Button onClick={() => stopGameSession(d)}>Остановить</Button>
              </>
            ),
          },
        ]}
        data={sessions.map((t) => [
          { link: `steam://connect/${t.url}`, label: t.url },
          t.matchId,
          t.info.mode,
          `${t.info.radiant.map((t) => t.name)} vs ${t.info.dire.map((t) => t.name)}`,
          t,
        ])}
        placeholderRows={5}
      />
    </>
  );
}
