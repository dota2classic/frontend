import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { LobbyScreen } from "@/containers";
import { EmbedProps, PageLink } from "@/components";
import { AppRouter } from "@/route";
import { redirectToPage } from "@/util/redirectToPage";

interface Props {
  id: string;
  lobby?: LobbyDto;
  host: string;
}

export default function LobbyPage({ lobby }: Props) {
  if (!lobby) {
    return (
      <>
        <h2>Лобби не существует!</h2>

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

  const lobby = await withTemporaryToken(ctx, async () => {
    try {
      return await getApi().lobby.lobbyControllerGetLobby(lobbyId);
    } catch (e) {
      if (e instanceof Response) {
        if (e.status === 403) {
          await redirectToPage(ctx, `/lobby?join=${lobbyId}`);
        } else if (e.status === 404) {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
  });

  let host: string;
  if (typeof window === "undefined") host = ctx.req!.headers.origin!;
  else host = window.location.origin;

  return {
    id: lobbyId,
    lobby,
    host,
  };
};
