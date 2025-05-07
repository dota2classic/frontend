import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import { LobbyDto, Role } from "@/api/back";
import { Button, Table, Tooltipable, UserPreview } from "@/components";
import { formatDotaMap, formatDotaMode, formatRole } from "@/util/gamemode";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import c from "./Lobby.module.scss";
import React, { useState } from "react";
import { JoinLobbyModal } from "@/containers";

interface Props {
  lobbies: LobbyDto[];
}
export default function ListLobbies({ lobbies }: Props) {
  const { auth } = useStore();
  const router = useRouter();

  const [pendingLobby, setPendingLobby] = useState<LobbyDto | undefined>(
    undefined,
  );
  return (
    <>
      {pendingLobby && (
        <JoinLobbyModal
          lobby={pendingLobby}
          onClose={() => setPendingLobby(undefined)}
        />
      )}
      {auth.isOld ? (
        <Button
          className={c.createLobby}
          onClick={() => {
            getApi()
              .lobby.lobbyControllerCreateLobby()
              .then((lobby) =>
                router.push(`/lobby/[id]`, `/lobby/${lobby.id}`),
              );
          }}
          disabled={!auth.isOld}
        >
          Создать лобби
        </Button>
      ) : (
        <Tooltipable
          className={c.createLobby}
          tooltip={`Создавать лобби могут только обладатели роли ${formatRole(Role.OLD)}`}
        >
          <div>
            <Button onClick={() => undefined} disabled={true}>
              Создать лобби
            </Button>
          </div>
        </Tooltipable>
      )}
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
}

ListLobbies.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const lobbies = await withTemporaryToken(ctx, () =>
    getApi().lobby.lobbyControllerListLobbies(),
  );

  return {
    lobbies,
  };
};
