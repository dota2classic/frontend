import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { Button, EmbedProps, Table, UserPreview } from "@/components";
import { formatDotaMap, formatDotaMode } from "@/util/gamemode";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import c from "./Lobby.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { JoinLobbyModal } from "@/containers";
import { observer } from "mobx-react-lite";
import { paidAction } from "@/util/subscription";
import { handleException } from "@/util/handleException";

interface Props {
  lobbies: LobbyDto[];
}
const ListLobbies = observer(function ListLobbies({ lobbies }: Props) {
  const { auth } = useStore();
  const router = useRouter();

  const [pendingLobby, setPendingLobby] = useState<LobbyDto | undefined>(
    undefined,
  );

  useEffect(() => {
    const joinLobbyId = router.query.join;
    const lobby = lobbies.find((t) => t.id === joinLobbyId);
    if (lobby) {
      setPendingLobby(lobby);
    }
  }, [lobbies, router]);

  const createLobby = useCallback(
    paidAction(async () => {
      try {
        return getApi()
          .lobby.lobbyControllerCreateLobby()
          .then((lobby) => router.push(`/lobby/[id]`, `/lobby/${lobby.id}`));
      } catch (e) {
        await handleException("Ошибка при создании лобби", e);
      }
    }),
    [],
  );
  return (
    <>
      <EmbedProps
        title={"Список лобби"}
        description={"Список игровых лобби "}
      />
      {pendingLobby && (
        <JoinLobbyModal
          lobby={pendingLobby}
          onClose={() => setPendingLobby(undefined)}
        />
      )}
      <Button className={c.createLobby} onClick={createLobby}>
        Создать лобби
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Лобби</th>
            <th>Хост</th>
            <th>Режим</th>
            <th>Карта</th>
            <th>Количество игроков</th>
            <th>Приватность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length === 0 ? (
            <td colSpan={7} className={c.empty}>
              Список лобби пуст
            </td>
          ) : (
            lobbies.map((lobby) => (
              <tr key={lobby.id}>
                <td>{lobby.name}</td>
                <td>
                  <UserPreview avatarSize={30} user={lobby.owner} />
                </td>
                <td>{formatDotaMode(lobby.gameMode)}</td>
                <td>{formatDotaMap(lobby.map)}</td>
                <td>{lobby.slots.length}</td>
                <td>{lobby.requiresPassword ? "С паролем" : "Без пароля"}</td>
                <td>
                  <Button
                    disabled={!auth.isAuthorized}
                    small
                    onClick={() => setPendingLobby(lobby)}
                  >
                    Присоединиться
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
});

export default ListLobbies;

ListLobbies["getInitialProps"] = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const lobbies = await withTemporaryToken(ctx, () =>
    getApi().lobby.lobbyControllerListLobbies(),
  );

  return {
    lobbies,
  };
};
