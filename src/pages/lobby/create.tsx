import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import Router from "next/router";

export default function CreateLobby() {
  return <>...</>;
}

CreateLobby.getInitialProps = async (ctx: NextPageContext) => {
  const lobby = await withTemporaryToken(ctx, () =>
    getApi().lobby.lobbyControllerCreateLobby(),
  );

  if (typeof window !== "undefined") {
    await Router.replace(location);
    return {};
  }

  ctx.res!.writeHead(302, { Location: `/lobby/${lobby.id}` });
  ctx.res!.end();
  return {};
};
