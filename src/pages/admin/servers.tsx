import { appApi, getApi } from "@/api/hooks";
import {
  DotaGameMode,
  DotaMap,
  DotaPatch,
  GameSessionDto,
  MatchmakingInfo,
  MatchmakingMode,
} from "@/api/back";
import React, { useCallback, useState } from "react";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useDidMount } from "@/util/useDidMount";
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
import { TranslationKey } from "@/TranslationKey";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import { Section } from "@/components/Section";
import { SelectOptions } from "@/components/SelectOptions";
import { RconModal } from "@/containers/RconModal";

interface PageProps {
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
    const [rconTarget, setRconTarget] = useState<GameSessionDto | undefined>(
      undefined,
    );
    return (
      <>
        <RconModal
          onClose={() => setRconTarget(undefined)}
          serverUrl={rconTarget?.url}
        />
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
              format: (gm) => t(`matchmaking_mode.${gm}` as TranslationKey),
            },
            {
              type: ColumnType.Raw,
              name: t("admin.servers.sessionList.teams"),
            },
            {
              type: ColumnType.Raw,
              name: t("admin.servers.sessionList.actions"),
              format: (d: GameSessionDto) => (
                <div className={c.buttons}>
                  <Button
                    disabled={!isAdmin}
                    onClick={() => stopGameSession(d)}
                  >
                    {t("admin.servers.sessionList.stop")}
                  </Button>
                  <Button disabled={!isAdmin} onClick={() => setRconTarget(d)}>
                    RCON
                  </Button>
                </div>
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
  },
);

export default function AdminServersPage({
  initialGameSessions,
  initialAllowedModes,
}: PageProps) {
  const { t } = useTranslation();
  const mounted = useDidMount();

  const dotaGameModeOptions = useDotaGameModeOptions();
  const dotaMapOptions = useDotaMapOptions();
  const { data: liveSessions } =
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
    await appApi.adminApi.serverControllerStopServer({ matchId: it.matchId });
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
        <header>{t("admin.servers.gameModes.title")}</header>

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
                <td>
                  {t(
                    `matchmaking_mode.${matchmakingMode.lobbyType}` as TranslationKey,
                  )}
                </td>
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
    const [initialGameSessions, initialAllowedModes] = await Promise.combine([
      getApi().adminApi.serverControllerLiveSessions(),
      getApi().statsApi.statsControllerGetMatchmakingInfo(),
    ]);

    return {
      initialGameSessions,
      initialAllowedModes,
    };
  });
};
