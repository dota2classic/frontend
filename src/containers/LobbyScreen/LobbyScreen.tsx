import React, { useCallback, useEffect, useMemo, useState } from "react";

import c from "./LobbyScreen.module.scss";
import {
  LobbyDto,
  LobbyUpdateType,
  LobbyUpdateTypeActionEnum,
  LobbyUpdateTypeFromJSON,
  ThreadType,
} from "@/api/back";
import { useEventSource } from "@/util/useEventSource";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import cx from "clsx";
import { LobbyTeam } from "./LobbyTeam";
import { observer } from "mobx-react-lite";
import { IoMdExit } from "react-icons/io";
import { makeSimpleToast } from "@/components/Toast";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { useTranslation } from "react-i18next";
import { EditLobbyModal } from "../EditLobbyModal";
import { Button } from "@/components/Button";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Tooltipable } from "@/components/Tooltipable";
import { IconButton } from "@/components/IconButton";
import { Thread } from "../Thread";
import { TranslationKey } from "@/TranslationKey";
import { useSummaries } from "@/util/use-summaries";
import { Surface } from "@/components/Surface";
import { PageHeader } from "@/components/PageHeader";
import { MetaStat } from "@/components/MetaStat";
import { MetaGrid, MetaGridStat } from "@/components/MetaGrid";

interface ILobbyScreenProps {
  lobby: LobbyDto;
}

export const LobbyScreen: React.FC<ILobbyScreenProps> = observer(
  function LobbyScreen({ lobby }) {
    const { t } = useTranslation();
    const evt = useEventSource<LobbyUpdateType>(
      getApi().lobby.lobbyControllerLobbyUpdatesContext({ id: lobby.id }),
      LobbyUpdateTypeFromJSON.bind(null),
      {
        data: lobby,
        lobbyId: lobby.id,
        action: LobbyUpdateTypeActionEnum.Update,
        kickedSteamIds: [],
      },
    );
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const router = useRouter();

    const { auth } = useStore();
    const { data, lobbyId } = evt || { data: lobby, lobbyId: lobby.id };
    const mySteamId = auth.parsedToken?.sub;

    const takeSlot = useCallback(
      (
        team: number | undefined,
        index: number,
        steamId: string | undefined,
      ) => {
        if (!data) return;

        getApi()
          .lobby.lobbyControllerChangeTeam(data.id, {
            team: team,
            index: index,
            steamId,
          })
          .catch();
      },
      [data],
    );

    const kickPlayer = useCallback(
      (steamId: string) => {
        getApi().lobby.lobbyControllerKickPlayer(lobbyId, { steamId }).catch();
      },
      [lobbyId],
    );

    useEffect(() => {
      if (!evt) return;

      if (evt.kickedSteamIds.includes(mySteamId || "-1")) {
        // We got kicked!
        router.push("/lobby");
        makeSimpleToast(t("lobby.kickedFromLobby"), t("lobby.kicked"), 5000);
      } else if (evt.action === "close") {
        router.push("/lobby");
        makeSimpleToast(
          t("lobby.kickedFromLobby"),
          t("lobby.lobbyClosed"),
          5000,
        );
      } else if (evt.action === "start") {
        router.push("/queue");
        makeSimpleToast(
          t("lobby.gameStarted"),
          t("lobby.connectionInfo"),
          5000,
        );
      }
    }, [evt, mySteamId, router, t]);

    const [$shuffleLobby, shuffleLobby] = useAsyncButton(async () => {
      if (!data || data.owner?.steamId !== mySteamId) return;
      getApi().lobby.lobbyControllerShuffleLobby(data.id).catch();
    }, [data, mySteamId]);

    const summaries = useSummaries(
      lobby.slots.map((t) => t.user?.steamId).filter(Boolean) as string[],
    );

    const [radiantMMR, direMMR] = useMemo(() => {
      if (!data) return [0, 0];

      let radiant = 0,
        dire = 0;

      for (const slot of data.slots) {
        if (!slot.user) continue;
        const mmr =
          summaries.summaries.get(slot.user.steamId)?.seasonStats.mmr || 1500;
        if (slot.team === 2) {
          radiant += mmr;
        } else if (slot.team === 3) {
          dire += mmr;
        }
      }

      return [radiant, dire];
    }, [data, summaries]);

    if (!auth.isAuthorized) {
      return <h2>{t("lobby.authorizeToView")}</h2>;
    }

    if (!data) {
      return <h2>{t("lobby.lobbyDoesNotExist")}</h2>;
    }

    const isOwner = data.owner?.steamId === mySteamId;

    const onUpdatedLobby = () => Promise.resolve();

    const launchGame = () => {
      getApi()
        .lobby.lobbyControllerStartLobby(data.id)
        .catch((e) => handleException(t("lobby.errorStartingLobby"), e));
    };

    const leaveLobby = () => {
      getApi()
        .lobby.lobbyControllerLeaveLobby(lobbyId)
        .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
        .then(() => router.push("/lobby"));
    };

    const radiant = data.slots.filter((t) => t.team === 2);
    const dire = data.slots.filter((t) => t.team === 3);
    const unassigned = data.slots
      .filter((t) => t.team === undefined)
      .filter((t) => t.user);

    return (
      <div className={c.gridPanel}>
        {isEditing && (
          <EditLobbyModal
            lobby={data}
            onUpdatedLobby={onUpdatedLobby}
            onClose={() => setIsEditing(false)}
          />
        )}
        <PageHeader
          className={c.grid12}
          actions={
            <MetaStat label={t("lobby.hostingLobby")} value={data.owner.name} />
          }
        />

        <Surface className={c.gridPanel} padding="xs" variant="panel">
          <LobbyTeam
            onKickPlayer={kickPlayer}
            isOwner={isOwner}
            team={2}
            onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
            onTakeSlot={(idx) => takeSlot(2, idx, mySteamId)}
            slots={radiant}
            totalMMR={radiantMMR}
          />
          <LobbyTeam
            onKickPlayer={kickPlayer}
            isOwner={isOwner}
            team={3}
            onTakeSlot={(idx) => takeSlot(3, idx, mySteamId)}
            onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
            slots={dire}
            totalMMR={direMMR}
          />
          <div className={cx(c.grid4, c.settings)}>
            <Button disabled={!isOwner || $shuffleLobby} onClick={shuffleLobby}>
              {t("lobby.shufflePlayers")}
            </Button>
            <Button disabled={!isOwner} onClick={() => setIsEditing(true)}>
              {t("lobby.settings")}
            </Button>
            <Button className={c.leaveLobby} onClick={leaveLobby}>
              {isOwner ? t("lobby.closeLobby") : t("lobby.leaveLobby")}
            </Button>
            <Button
              mega
              disabled={!isOwner}
              className={c.startGame}
              onClick={launchGame}
            >
              {t("lobby.startGame")}
            </Button>
          </div>
        </Surface>

        <Surface
          className={cx(c.grid12, c.unassignedList)}
          padding="xs"
          variant="panel"
        >
          {unassigned.length ? (
            <>
              {unassigned.map((slot) => (
                <div
                  className={cx(c.playerPreview, c.unassigned)}
                  key={slot.user!.steamId}
                >
                  <PlayerAvatar
                    user={slot.user!}
                    width={20}
                    height={20}
                    alt={""}
                  />
                  <span className={c.username}>{slot.user!.name}</span>
                  {isOwner && (
                    <Tooltipable tooltip={t("lobby.kickFromLobby")}>
                      <IconButton
                        onClick={() => kickPlayer(slot.user!.steamId)}
                      >
                        <IoMdExit />
                      </IconButton>
                    </Tooltipable>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className={c.unassignedHint}>
              {t("lobby.unassignedPlayers")}
            </div>
          )}
        </Surface>
        <Thread
          threadType={ThreadType.LOBBY}
          id={lobbyId}
          className={cx(c.grid12, c.threadContainer)}
        />
        <Surface
          className={cx(c.grid12, c.options)}
          padding="xs"
          variant="panel"
        >
          <MetaGrid gap={4}>
            <MetaGridStat label={t("lobby.lobbyName")} value={data.name} />
            <MetaGridStat
              label={t("lobby.password")}
              value={data.requiresPassword ? t("lobby.yes") : t("lobby.no")}
            />
            <MetaGridStat
              label={t("lobby.map")}
              value={t(`dota_map.${data.map}` as TranslationKey)}
            />
            <MetaGridStat
              label={t("lobby.mode")}
              value={t(`game_mode.${data.gameMode}` as TranslationKey)}
            />
            <MetaGridStat
              label={t("lobby.banStage")}
              value={data.enableBanStage ? t("lobby.yes") : t("lobby.no")}
            />
            <MetaGridStat
              label={t("lobby.cheats")}
              value={data.enableCheats ? t("lobby.yes") : t("lobby.no")}
            />
            <MetaGridStat
              label={t("lobby.bots")}
              value={data.fillBots ? t("lobby.yes") : t("lobby.no")}
            />
            <MetaGridStat
              label={t("lobby.midMode")}
              value={data.midTowerToWin ? t("lobby.yes") : t("lobby.no")}
            />
            <MetaGridStat
              label={t("lobby.killsToWin")}
              value={
                data.midTowerKillsToWin > 0
                  ? t("lobby.yesUpToKills", { kills: data.midTowerKillsToWin })
                  : t("lobby.no")
              }
            />
            <MetaGridStat
              label={t("lobby.runes")}
              value={data.noRunes ? t("lobby.no") : t("lobby.yes")}
            />
            <MetaGridStat label={t("lobby.patch")} value={data.patch} />
            <MetaGridStat label={t("lobby.region")} value={data.region} />
          </MetaGrid>
        </Surface>
      </div>
    );
  },
);
