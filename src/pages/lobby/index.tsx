import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { Button, PageLink, Table } from "@/components";
import { AppRouter } from "@/route";
import { formatDotaMap, formatDotaMode } from "@/util/gamemode";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import c from "./Lobby.module.scss";

interface Props {
  lobbies: LobbyDto[];
}
export default function ListLobbies({ lobbies }: Props) {
  const { auth } = useStore();
  const router = useRouter();
  return (
    <>
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
            <th>Режим</th>
            <th>Карта</th>
            <th>Количество игроков</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.map((lobby) => (
            <tr key={lobby.id}>
              <td>
                <PageLink link={AppRouter.lobby.lobby(lobby.id).link}>
                  Лобби #{lobby.id}
                </PageLink>
              </td>
              <td>{formatDotaMode(lobby.gameMode)}</td>
              <td>{formatDotaMap(lobby.map)}</td>
              <td>{lobby.slots.length}</td>
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
