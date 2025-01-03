import { NextPageContext } from "next";
import {
  DotaGameMode,
  DotaMap,
  LobbyDto,
  LobbySlotDto,
  LobbyUpdateType,
  LobbyUpdateTypeFromJSON,
  ThreadType,
  UserDTO,
} from "@/api/back";
import { getApi } from "@/api/hooks";
import c from "./Lobby.module.scss";
import {
  Button,
  CopySomething,
  Panel,
  PlayerAvatar,
  SelectOptions,
} from "@/components";
import { useCallback, useEffect } from "react";
import cx from "clsx";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { IoMdClose } from "react-icons/io";
import { useEventSource } from "@/util";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { ThreadStyle } from "@/containers/Thread/types";
import { Thread } from "@/containers";
import { DotaGameModeOptions, DotaMapOptions } from "@/const/options";

interface Props {
  id: string;
  lobby?: LobbyDto;
  host: string;
}

interface TeamProps {
  isOwner: boolean;
  slots: LobbySlotDto[];
  onTakeSlot: (index: number) => void;
  team: number | undefined;
  maxSlots: number;
  onRemoveSlot: (index: number, steamId: string) => void;
}

const Team = observer(
  ({ slots, isOwner, onTakeSlot, onRemoveSlot, team, maxSlots }: TeamProps) => {
    const { auth } = useStore();
    const canRemove = (u: UserDTO) =>
      isOwner || auth.parsedToken?.sub === u.steamId;
    return (
      <div className={c.grid4}>
        <h2 className={cx(c.team, team === 2 && "green", team == 3 && "red")}>
          {team === 2
            ? "Силы света"
            : team === 3
              ? "Силы тьмы"
              : "Неопределившиеся"}
        </h2>
        <div className={c.slots}>
          {new Array(maxSlots).fill(null).map((_, index) => {
            const slot = slots.find((t) => t.index === index);

            if (slot)
              return (
                <div
                  key={slot.user.steamId}
                  className={cx(c.slot, c.playerPreview)}
                >
                  <PlayerAvatar
                    src={slot.user.avatar}
                    width={34}
                    height={34}
                    alt={""}
                  />
                  <span className={c.username}>{slot.user.name}</span>
                  {canRemove(slot.user) && (
                    <IoMdClose
                      onClick={() => onRemoveSlot(index, slot!.user.steamId)}
                    />
                  )}
                </div>
              );

            return (
              <div key={`inactive-${index}`} className={c.slot}>
                <span className={c.takeSlot} onClick={() => onTakeSlot(index)}>
                  Занять место
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export default function LobbyPage({ id, lobby, host }: Props) {
  const evt = useEventSource<LobbyUpdateType>(
    getApi().lobby.lobbyControllerLobbyUpdatesContext({ id }),
    LobbyUpdateTypeFromJSON.bind(null),
    { data: lobby, lobbyId: id },
  );

  const { data, lobbyId } = evt || { data: lobby, lobbyId: id };

  const mySteamId = useStore().auth.parsedToken?.sub;

  const router = useRouter();

  const updateLobby = async (
    map: DotaMap | undefined,
    gameMode: DotaGameMode | undefined,
  ) => {
    if (!data) return;
    await getApi().lobby.lobbyControllerUpdateLobby(data.id, {
      map,
      gameMode,
    });
  };

  const launchGame = () => {
    if (!data) return;
    getApi()
      .lobby.lobbyControllerStartLobby(data.id)
      .then(() => router.push("/queue"));
  };

  const leaveLobby = () => {
    getApi()
      .lobby.lobbyControllerLeaveLobby(lobbyId)
      .then(() => router.push("/lobby"));
  };

  const takeSlot = useCallback(
    (team: number | undefined, index: number, steamId: string | undefined) => {
      if (!data) return;

      getApi().lobby.lobbyControllerChangeTeam(data.id, {
        team: team,
        index: index,
        steamId,
      });
    },
    [data],
  );

  useEffect(() => {
    if (!data) {
      router.push("/lobby");
    }
  }, [data]);

  if (!data)
    return (
      <>
        <h1>Лобби не найдено</h1>
      </>
    );

  const radiant = data.slots.filter((t) => t.team === 2);
  const dire = data.slots.filter((t) => t.team === 3);
  const unassigned = data.slots.filter((t) => t.team === undefined);

  return (
    <div className={c.gridPanel}>
      <Panel className={c.grid12}>
        <div className="right">
          <dl>
            <dd>{data.owner.name}</dd>
            <dt>Хост лобби</dt>
          </dl>
          <dl>
            <dd>
              <CopySomething
                something={`${host}/lobby/${data.id}`}
                placeholder={"Нажми для копирования"}
              />
            </dd>
            <dt>Ссылка на приглашение</dt>
          </dl>
        </div>
      </Panel>

      <Panel className={c.gridPanel}>
        <Team
          isOwner={data.owner.steamId === mySteamId}
          maxSlots={5}
          team={2}
          onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
          onTakeSlot={(idx) => takeSlot(2, idx, mySteamId)}
          slots={radiant}
        />
        <Team
          isOwner={data.owner.steamId === mySteamId}
          maxSlots={5}
          team={3}
          onTakeSlot={(idx) => takeSlot(3, idx, mySteamId)}
          onRemoveSlot={(idx, steamId) => takeSlot(undefined, 0, steamId)}
          slots={dire}
        />
        <div className={cx(c.grid4, c.settings)}>
          <h4>Карта</h4>
          <SelectOptions
            options={DotaMapOptions}
            selected={data.map}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                updateLobby(value.value, undefined);
              }
            }}
            defaultText={"Карта"}
          />
          <h4>Режим игры</h4>
          <SelectOptions
            options={DotaGameModeOptions}
            selected={data.gameMode}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                updateLobby(undefined, value.value);
              }
            }}
            defaultText={"Режим игры"}
          />
          <Button className={c.startGame} onClick={launchGame}>
            Запустить игру
          </Button>
          <Button className={c.leaveLobby} onClick={leaveLobby}>
            Покинуть лобби
          </Button>
        </div>
      </Panel>

      <Panel className={cx(c.grid12, c.unassignedList)}>
        {unassigned.length ? (
          unassigned.map((slot) => (
            <div
              className={cx(c.playerPreview, c.unassigned)}
              key={slot.user.steamId}
            >
              <PlayerAvatar
                src={slot.user.avatar}
                width={20}
                height={20}
                alt={""}
              />
              <span className={c.username}>{slot.user.name}</span>
            </div>
          ))
        ) : (
          <div className={c.unassignedHint}>Неопределившиеся</div>
        )}
      </Panel>
      <Thread
        threadType={ThreadType.LOBBY}
        id={lobbyId}
        className={cx(c.grid12, c.threadContainer)}
        threadStyle={ThreadStyle.CHAT}
        showLastMessages={100}
        scrollToLast={true}
      />
      {/*<div className={cx(c.grid4, c.buttons)}>*/}
      {/*  <Button mega onClick={launchGame}>*/}
      {/*    Запустить игру*/}
      {/*  </Button>*/}
      {/*  <Button onClick={leaveLobby}>Покинуть лобби</Button>*/}
      {/*</div>*/}
    </div>
  );
}

LobbyPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const lobbyId = ctx.query.id as string;

  const lobby = await withTemporaryToken(ctx, () =>
    getApi()
      .lobby.lobbyControllerJoinLobby(lobbyId)
      .catch(() => undefined),
  );

  let host: string;
  if (typeof window === "undefined") host = ctx.req!.headers.origin!;
  else host = window.location.origin;

  return {
    id: lobbyId,
    lobby,
    host,
  };
};
