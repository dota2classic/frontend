import { appApi, getApi } from "@/api/hooks";
import {
  Button,
  GenericTable,
  Section,
  SelectOptions,
  Table,
} from "@/components";
import {
  DotaGameMode,
  DotaMap,
  DotaPatch,
  GameServerDto,
  GameSessionDto,
  MatchmakingInfo,
  MatchmakingMode,
} from "@/api/back";
import React, { useCallback } from "react";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useDidMount } from "@/util";
import c from "./AdminStyles.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { NextPageContext } from "next";
import { MatchmakingModes } from "@/store/queue/mock";
import { ColumnType } from "@/const/tables";
import {
  DotaPatchOptions,
  useDotaGameModeOptions,
  useDotaMapOptions,
} from "@/const/options";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    return (
      <GenericTable
        keyProvider={(t) => t[1]}
        columns={[
          {
            type: ColumnType.ExternalLink,
            name: t("admin.servers.sessionList.link"),
          },
          {
            type: ColumnType.Raw,
            name: t("admin.servers.sessionList.matchId"),
          },
          {
            type: ColumnType.Raw,
            name: t("admin.servers.sessionList.mode"),
            format: (gm) => t(`matchmaking_mode.${gm}`),
          },
          {
            type: ColumnType.Raw,
            name: t("admin.servers.sessionList.teams"),
          },
          {
            type: ColumnType.Raw,
            name: t("admin.servers.sessionList.actions"),
            format: (d) => (
              <>
                <Button disabled={!isAdmin} onClick={() => stopGameSession(d)}>
                  {t("admin.servers.sessionList.stop")}
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
    const { t } = useTranslation();
    return (
      <Table>
        <thead>
          <tr>
            <th>{t("admin.servers.serverPool.link")}</th>
            <th>{t("admin.servers.serverPool.version")}</th>
            <th>{t("admin.servers.serverPool.actions")}</th>
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
                  {t("admin.servers.serverPool.stop")}
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
  const { t } = useTranslation();
  const mounted = useDidMount();

  const dotaGameModeOptions = useDotaGameModeOptions();
  const dotaMapOptions = useDotaMapOptions();
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
      enableCheats: existing?.enableCheats || false,
      fillBots: existing?.fillBots || false,
      patch: existing?.patch || DotaPatch.DOTA_684,
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
      enableCheats: boolean,
      fillBots: boolean,
      patch: DotaPatch,
    ) => {
      appApi.adminApi
        .adminUserControllerUpdateGameMode({
          mode: lobbyType,
          dotaGameMode: gamemode,
          dotaMap: dotaMap,
          enabled: enabled,
          enableCheats,
          fillBots,
          patch,
        })
        .then(mutate);
    },
    [mutate],
  );
  return (
    <div className={c.gridPanel}>
      <Section className={c.grid12}>
        <header>{t("admin.servers.gameModes")}</header>

        <Table>
          <thead>
            <tr>
              <th>{t("admin.servers.gameModes.mode")}</th>
              <th style={{ width: 200 }}>
                {t("admin.servers.gameModes.gameMode")}
              </th>
              <th>{t("admin.servers.gameModes.map")}</th>
              <th>{t("admin.servers.gameModes.patch")}</th>
              <th>{t("admin.servers.gameModes.active")}</th>
              <th>{t("admin.servers.gameModes.cheats")}</th>
              <th>{t("admin.servers.gameModes.bots")}</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((matchmakingMode) => (
              <tr key={matchmakingMode.lobbyType.toString()}>
                <td>{t(`matchmaking_mode.${matchmakingMode.lobbyType}`)}</td>
                <td>
                  <SelectOptions
                    defaultText={t("admin.servers.gameModes.selectGameMode")}
                    options={dotaGameModeOptions}
                    selected={matchmakingMode.gameMode}
                    onSelect={(value) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        value.value,
                        matchmakingMode.dotaMap,
                        matchmakingMode.enabled,
                        matchmakingMode.enableCheats,
                        matchmakingMode.fillBots,
                        matchmakingMode.patch,
                      )
                    }
                  />
                </td>
                <td>
                  <SelectOptions
                    defaultText={t("admin.servers.gameModes.selectMap")}
                    options={dotaMapOptions}
                    selected={matchmakingMode.dotaMap}
                    onSelect={(value) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        matchmakingMode.gameMode,
                        value.value,
                        matchmakingMode.enabled,
                        matchmakingMode.enableCheats,
                        matchmakingMode.fillBots,
                        matchmakingMode.patch,
                      )
                    }
                  />
                </td>
                <td>
                  <SelectOptions
                    defaultText={t("admin.servers.gameModes.selectPatch")}
                    options={DotaPatchOptions}
                    selected={matchmakingMode.patch}
                    onSelect={(value) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        matchmakingMode.gameMode,
                        matchmakingMode.dotaMap,
                        matchmakingMode.enabled,
                        matchmakingMode.enableCheats,
                        matchmakingMode.fillBots,
                        value.value,
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    onChange={(e) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        matchmakingMode.gameMode,
                        matchmakingMode.dotaMap,
                        e.target.checked,
                        matchmakingMode.enableCheats,
                        matchmakingMode.fillBots,
                        matchmakingMode.patch,
                      )
                    }
                    type="checkbox"
                    checked={matchmakingMode.enabled}
                  />
                </td>

                <td>
                  <input
                    onChange={(e) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        matchmakingMode.gameMode,
                        matchmakingMode.dotaMap,
                        matchmakingMode.enabled,
                        e.target.checked,
                        matchmakingMode.fillBots,
                        matchmakingMode.patch,
                      )
                    }
                    type="checkbox"
                    checked={matchmakingMode.enableCheats}
                  />
                </td>
                <td>
                  <input
                    onChange={(e) =>
                      updateGameMode(
                        matchmakingMode.lobbyType,
                        matchmakingMode.gameMode,
                        matchmakingMode.dotaMap,
                        matchmakingMode.enabled,
                        matchmakingMode.enableCheats,
                        e.target.checked,
                        matchmakingMode.patch,
                      )
                    }
                    type="checkbox"
                    checked={matchmakingMode.fillBots}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <div className={c.grid12}>
        <h3>{t("admin.servers.serverPool.title")}</h3>

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
        <h3>{t("admin.servers.currentSessions")}</h3>
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
