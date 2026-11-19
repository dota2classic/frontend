import { NextPageContext } from "next";
import Router from "next/router";
import { getRequestApi } from "@/api/request-api";

export default function CreateLobby() {
  return <>...</>;
}

CreateLobby.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const lobby = await api.lobby.lobbyControllerCreateLobby();

  if (typeof window !== "undefined") {
    await Router.replace(location);
    return {};
  }

  ctx.res!.writeHead(302, { Location: `/lobby/${lobby.id}` });
  ctx.res!.end();
  return {};
};
