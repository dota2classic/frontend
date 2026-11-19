import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { LobbyScreen } from "@/containers/LobbyScreen";
import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { redirectToPage } from "@/util/redirectToPage";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";

interface Props {
  id: string;
  lobby?: LobbyDto;
  host: string;
}

export default function LobbyPage({ lobby }: Props) {
  const { t } = useTranslation();

  if (!lobby) {
    return (
      <>
        <h2>{t("lobby_page.lobbyDoesNotExist")}</h2>

        <PageLink link={AppRouter.lobby.index.link}>
          {t("lobby_page.returnToLobbyList")}
        </PageLink>
      </>
    );
  }
  return (
    <>
      <EmbedProps
        title={t("lobby_page.seo.title", { lobbyName: lobby.name })}
        description={t("lobby_page.seo.description")}
      />
      <LobbyScreen lobby={lobby} />
    </>
  );
}

LobbyPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const api = getRequestApi(ctx);
  const lobbyId = ctx.query.id as string;

  const lobby = await api.lobby
    .lobbyControllerGetLobby(lobbyId)
    .catch(async (e: unknown) => {
      if (e instanceof Response && e.status === 403) {
        await redirectToPage(ctx, `/lobby?join=${lobbyId}`);
      }
      return undefined;
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
