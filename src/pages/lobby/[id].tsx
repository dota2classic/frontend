import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { LobbyScreen } from "@/containers";
import { EmbedProps, PageLink } from "@/components";
import { AppRouter } from "@/route";

interface Props {
  id: string;
  lobby?: LobbyDto;
  host: string;
}

export default function LobbyPage({ lobby }: Props) {
  if (!lobby) {
    return (
      <>
        <h2>Лобби не существует или у тебя нет доступа</h2>

        <PageLink link={AppRouter.lobby.index.link}>
          Вернуться к списку лобби
        </PageLink>
      </>
    );
  }
  return (
    <>
      <EmbedProps title={`Лобби ${lobby.name}`} description={"Лобби"} />
      <LobbyScreen lobby={lobby} />
    </>
  );
}

LobbyPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const lobbyId = ctx.query.id as string;

  const lobby = await withTemporaryToken(ctx, () =>
    getApi()
      .lobby.lobbyControllerGetLobby(lobbyId)
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
