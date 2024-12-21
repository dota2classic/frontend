import { appApi, getApi } from "@/api/hooks";
import {
  Button,
  GenericTable,
  Section,
  SelectOptions,
  Table,
} from "@/components";
import { formatGameMode } from "@/util/gamemode";
import {
  DotaGameMode,
  DotaMap,
  GameServerDto,
  GameSessionDto,
  MatchmakingInfo,
  MatchmakingMode,
} from "@/api/back";
import React, { useCallback } from "react";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useDidMount } from "@/util/hooks";
import c from "./AdminStyles.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { NextPageContext } from "next";
import { MatchmakingModes } from "@/store/queue/mock";
import {
  DotaGameModeOptions,
  DotaMapOptions,
} from "@/components/SelectOptions/SelectOptions";

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

  const modes = MatchmakingModes.map((lobbyType) => {
    const existing = (allowedModes || initialAllowedModes).find(
      (t) => t.lobbyType === lobbyType,
    );

    return {
      lobbyType,
      gameMode: existing?.gameMode || DotaGameMode.ALLPICK,
      dotaMap: existing?.dotaMap || DotaMap.DOTA,
      enabled: existing?.enabled || false,
    };
  });

  const sessions: GameSessionDto[] = liveSessions || [];

  const stopGameSession = useCallback(async (it: GameSessionDto) => {
    await appApi.adminApi.serverControllerStopServer({ url: it.url });
  }, []);

  const updateGameMode = useCallback(
    (
      lobbyType: MatchmakingMode,
      gamemode: DotaGameMode,
      dotaMap: DotaMap,
      enabled: boolean,
    ) => {
      appApi.adminApi
        .adminUserControllerUpdateGameMode({
          mode: lobbyType,
          dotaGameMode: gamemode,
          dotaMap: dotaMap,
          enabled: enabled,
        })
        .then(mutate);
    },
    [mutate],
  );
  return (
    <div className={c.gridPanel}>
      <Section className={c.grid12}>
        <header>Режимы игры</header>

        <Table>
          <thead>
            <tr>
              <th>Режим</th>
              <th style={{ width: 200 }}>Игровой режим</th>
              <th>Карта</th>
              <th>Активен</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((t) => (
              <tr key={t.lobbyType.toString()}>
                <td>{formatGameMode(t.lobbyType)}</td>
                <td>
                  <SelectOptions
                    defaultText={"Режим игры"}
                    options={DotaGameModeOptions}
                    selected={t.gameMode}
                    onSelect={(value) =>
                      updateGameMode(
                        t.lobbyType,
                        value.value,
                        t.dotaMap,
                        t.enabled,
                      )
                    }
                  />
                </td>
                <td>
                  <SelectOptions
                    defaultText={"Карта"}
                    options={DotaMapOptions}
                    selected={t.dotaMap}
                    onSelect={(value) =>
                      updateGameMode(
                        t.lobbyType,
                        t.gameMode,
                        value.value,
                        t.enabled,
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    onChange={(e) =>
                      updateGameMode(
                        t.lobbyType,
                        t.gameMode,
                        t.dotaMap,
                        e.target.checked,
                      )
                    }
                    type="checkbox"
                    checked={t.enabled}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <div className={c.grid12}>
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

      <div className={c.grid12}>
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
