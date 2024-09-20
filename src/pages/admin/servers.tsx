import { appApi, useApi } from "@/api/hooks";
import { Table } from "@/components";
import { Dota2Version, formatGameMode } from "@/util/gamemode";

export default function AdminServersPage() {
  const { data: serverPool } =
    useApi().adminApi.useServerControllerServerPool();
  const { data: liveSessions, mutate: mutateLiveSessions } =
    useApi().adminApi.useServerControllerLiveSessions();

  const { data: allowedModes, mutate } =
    useApi().statsApi.useStatsControllerGetMatchmakingInfo();

  const modes = (allowedModes || [])
    .sort((a, b) => a.mode - b.mode)
    .filter((it) => it.version === Dota2Version.Dota_684);
  return (
    <>
      <h3>Режимы игры</h3>

      <Table>
        <thead>
          <tr>
            <th>Ссылка</th>
            <th>Версия игры</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {modes.map((t) => (
            <tr>
              <td>{t.version}</td>
              <td>{formatGameMode(t.mode)}</td>
              <td>
                <input
                  onChange={(e) => {
                    appApi.adminApi
                      .adminUserControllerUpdateGameMode({
                        mode: t.mode as any,
                        version: t.version as any,
                        enabled: e.target.checked,
                      })
                      .then((result) => mutate(result as any));
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
            <tr>
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

      <Table>
        <thead>
          <tr>
            <th>Ссылка</th>
            <th>ID матча</th>
            <th>Режим</th>
            <th>Команды</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>{liveSessions?.map((t) => <LiveSession {...t} />)}</tbody>
      </Table>
    </>
  );
}
