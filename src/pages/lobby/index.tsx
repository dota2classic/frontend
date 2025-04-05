import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { Button, Table, UserPreview } from "@/components";
import { formatDotaMap, formatDotaMode } from "@/util/gamemode";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import c from "./Lobby.module.scss";
import { useState } from "react";
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
      <Button
        className={c.createLobby}
        onClick={() => {
          getApi()
            .lobby.lobbyControllerCreateLobby()
            .then((lobby) => router.push(`/lobby/[id]`, `/lobby/${lobby.id}`));
        }}
        disabled={!(auth.isModerator || auth.isAdmin)}
      >
        Создать лобби
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Лобби</th>
            <th>Владелец</th>
            <th>Режим</th>
            <th>Карта</th>
            <th>Количество игроков</th>
            <th>Приватность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby) => (
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
          ))}
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
