import React, { useCallback, useEffect, useState } from "react";

import { EditLobbyModal, Thread } from "..";

import c from "./LobbyScreen.module.scss";
import {
  LobbyDto,
  LobbyUpdateType,
  LobbyUpdateTypeFromJSON,
  ThreadType,
} from "@/api/back";
import { useEventSource } from "@/util";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import {
  Button,
  CopySomething,
  IconButton,
  Panel,
  PlayerAvatar,
  Tooltipable,
} from "@/components";
import cx from "clsx";
import { LobbyTeam } from "@/containers/LobbyScreen/LobbyTeam";
import { observer } from "mobx-react-lite";
import { formatDotaMap, formatDotaMode } from "@/util/gamemode";
import { IoMdExit } from "react-icons/io";
import { makeSimpleToast } from "@/components/Toast/toasts";

interface ILobbyScreenProps {
  lobby: LobbyDto;
}

export const LobbyScreen: React.FC<ILobbyScreenProps> = observer(
  ({ lobby }) => {
    const evt = useEventSource<LobbyUpdateType>(
      getApi().lobby.lobbyControllerLobbyUpdatesContext({ id: lobby.id }),
      LobbyUpdateTypeFromJSON.bind(null),
      { data: lobby, lobbyId: lobby.id },
    );
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const router = useRouter();

    const { auth } = useStore();
    const { data, lobbyId } = evt || { data: lobby, lobbyId: lobby.id };

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
      if (!data) {
        router.push("/lobby");
        makeSimpleToast(
          "Лобби не существует",
          "Лобби было распущено или тебя выгнали",
          5000,
        );
      }
    }, [data]);

    // AMGOUS

    if (!auth.isAuthorized) {
      return <h2>Авторизуйся, чтобы смотреть эту страницу</h2>;
    }

    if (!data) {
      return <h2>Лобби не существует</h2>;
    }

    const host = "123";

    const mySteamId = auth.parsedToken?.sub;
    const isOwner = data.owner?.steamId === mySteamId;

    const onUpdatedLobby = () => Promise.resolve();

    const launchGame = () => {
      getApi()
        .lobby.lobbyControllerStartLobby(data.id)
        .then(() => router.push("/queue"));
    };

    const leaveLobby = () => {
      getApi()
        .lobby.lobbyControllerLeaveLobby(lobbyId)
        .then(() => router.push("/lobby"));
    };

    const radiant = data.slots.filter((t) => t.team === 2);
    const dire = data.slots.filter((t) => t.team === 3);
    const unassigned = data.slots.filter((t) => t.team === undefined);

    return (
      <div className={c.gridPanel}>
        {isEditing && (
          <EditLobbyModal
            lobby={data}
            onUpdatedLobby={onUpdatedLobby}
            onClose={() => setIsEditing(false)}
          />
        )}
        <Panel className={c.grid12}>
          <div className="right">
            <dl>
              <dd>{data.owner.name}</dd>
              <dt>Хост лобби</dt>
            </dl>
            <dl>
              <dd>
                <CopySomething
                  className={c.padded}
                  something={`${host}/lobby?join=${data.id}`}
                  placeholder={"Нажми для копирования"}
                />
              </dd>
              <dt>Ссылка на приглашение</dt>
            </dl>
          </div>
        </Panel>

        <Panel className={c.gridPanel}>
          <LobbyTeam
            onKickPlayer={kickPlayer}
            isOwner={isOwner}
            maxSlots={5}
            team={2}
            onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
            onTakeSlot={(idx) => takeSlot(2, idx, mySteamId)}
            slots={radiant}
          />
          <LobbyTeam
            onKickPlayer={kickPlayer}
            isOwner={isOwner}
            maxSlots={5}
            team={3}
            onTakeSlot={(idx) => takeSlot(3, idx, mySteamId)}
            onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
            slots={dire}
          />
          <div className={cx(c.grid4, c.settings)}>
            <Button disabled={!isOwner} onClick={() => setIsEditing(true)}>
              Настройки
            </Button>
            <Button
              disabled={!isOwner}
              className={c.startGame}
              onClick={launchGame}
            >
              Запустить игру
            </Button>
            <Button className={c.leaveLobby} onClick={leaveLobby}>
              {isOwner ? "Закрыть лобби" : "Покинуть лобби"}
            </Button>
          </div>
        </Panel>

        <Panel className={cx(c.grid12, c.unassignedList)}>
          {unassigned.length ? (
            <>
              {unassigned.map((slot) => (
                <div
                  className={cx(c.playerPreview, c.unassigned)}
                  key={slot.user.steamId}
                >
                  <PlayerAvatar
                    user={slot.user}
                    width={20}
                    height={20}
                    alt={""}
                  />
                  <span className={c.username}>{slot.user.name}</span>
                  {isOwner && (
                    <Tooltipable tooltip={`Выгнать из лобби`}>
                      <IconButton
                        onClick={() => kickPlayer(slot!.user.steamId)}
                      >
                        <IoMdExit />
                      </IconButton>
                    </Tooltipable>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className={c.unassignedHint}>Неопределившиеся</div>
          )}
        </Panel>
        <Panel className={cx(c.grid12, c.options)}>
          <dl>
            <dt>Имя лобби</dt>
            <dd>{data.name}</dd>
          </dl>
          <dl>
            <dt>Пароль</dt>
            <dd>{data.requiresPassword ? "Да" : "Нет"}</dd>
          </dl>
          <dl>
            <dt>Карта</dt>
            <dd>{formatDotaMap(data.map)}</dd>
          </dl>
          <dl>
            <dt>Режим</dt>
            <dd>{formatDotaMode(data.gameMode)}</dd>
          </dl>
          <dl>
            <dt>Читы</dt>
            <dd>{data.enableCheats ? "Да" : "Нет"}</dd>
          </dl>
          <dl>
            <dt>Боты</dt>
            <dd>{data.fillBots ? "Да" : "Нет"}</dd>
          </dl>
        </Panel>
        <Thread
          threadType={ThreadType.LOBBY}
          id={lobbyId}
          className={cx(c.grid12, c.threadContainer)}
        />
      </div>
    );
  },
);
