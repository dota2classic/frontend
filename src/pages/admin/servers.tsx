import { appApi, getApi } from "@/api/hooks";
import { Button, GenericTable, Section, Table } from "@/components";
import { formatGameMode } from "@/util/gamemode";
import {
  Dota2Version,
  GameServerDto,
  GameSessionDto,
  MatchmakingInfo,
} from "@/api/back";
import React, { useCallback } from "react";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useDidMount } from "@/util/hooks";
import c from "./AdminStyles.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { NextPageContext } from "next";

interface PageProps {
  initialServerPool: GameServerDto[];
  initialGameSessions: GameSessionDto[];
  initialAllowedModes: MatchmakingInfo[];
}

const SessionList = observer(
  ({
    sessions,
    stopGameSession,
  }: {
    stopGameSession: (d: GameSessionDto) => void;
    sessions: GameSessionDto[];
  }) => {
    const { isAdmin } = useStore().auth;
    return (
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
                <Button disabled={!isAdmin} onClick={() => stopGameSession(d)}>
                  Остановить
                </Button>
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
    );
  },
);

const ServerPool = observer(
  ({
    serverPool,
    onKillServer,
  }: {
    serverPool: GameServerDto[];
    onKillServer: (url: string) => void;
  }) => {
    const { isAdmin } = useStore().auth;
    return (
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
                  disabled={!isAdmin}
                  className="small"
                  onClick={() => onKillServer(it.url)}
                >
                  Остановить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
);

export default function AdminServersPage({
  initialServerPool,
  initialGameSessions,
  initialAllowedModes,
}: PageProps) {
  const mounted = useDidMount();
  const { data: serverPool } = getApi().adminApi.useServerControllerServerPool({
    fallbackData: initialServerPool,
    isPaused() {
      return mounted;
    },
  });
  const { data: liveSessions, mutate: mutateLiveSessions } =
    getApi().adminApi.useServerControllerLiveSessions({
      fallbackData: initialGameSessions,
      isPaused() {
        return mounted;
      },
    });

  const { data: allowedModes, mutate } =
    getApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: initialAllowedModes,
      isPaused() {
        return mounted;
      },
    });

  const modes = (allowedModes || ([] as MatchmakingInfo[]))
    .sort((a, b) => a.mode - b.mode)
    .filter((it) => it.version === Dota2Version.Dota_684);

  const sessions: GameSessionDto[] = liveSessions || [];

  const stopGameSession = useCallback(async (it: GameSessionDto) => {
    await appApi.adminApi.serverControllerStopServer({ url: it.url });
  }, []);

  return (
    <div className={c.gridPanel}>
      <Section className={c.grid12}>
        <header>Режимы игры</header>

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
                        .then((data) =>
                          mutate(data as unknown as MatchmakingInfo[]),
                        );
                    }}
                    type="checkbox"
                    checked={t.enabled}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <div className={c.grid8}>
        <h3>Пул серверов</h3>

        <ServerPool
          serverPool={serverPool!}
          onKillServer={async (url) => {
            await appApi.adminApi.serverControllerStopServer({
              url: url,
            });
            await mutateLiveSessions();
          }}
        />
      </div>

      <div className={c.grid4}>
        <h3>Текущие сессии</h3>
        <SessionList sessions={sessions} stopGameSession={stopGameSession} />
      </div>
    </div>
  );
}

AdminServersPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<PageProps> => {
  return withTemporaryToken(ctx, async () => {
    const [initialServerPool, initialGameSessions, initialAllowedModes] =
      await Promise.combine([
        getApi().adminApi.serverControllerServerPool(),
        getApi().adminApi.serverControllerLiveSessions(),
        getApi().statsApi.statsControllerGetMatchmakingInfo(),
      ]);

    return {
      initialServerPool,
      initialGameSessions,
      initialAllowedModes,
    };
  });
};
