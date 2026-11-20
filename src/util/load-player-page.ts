import { NextPageContext } from "next";
import { PlayerSummaryDto } from "@/api/back";
import { AppApi } from "@/api/hooks";
import { getRequestApi } from "@/api/request-api";

export const loadPlayerPage = async <T extends readonly unknown[] | []>(
  ctx: NextPageContext,
  load: (api: AppApi, playerId: string) => T,
): Promise<{
  playerId: string;
  summary: PlayerSummaryDto;
  data: { -readonly [K in keyof T]: Awaited<T[K]> };
}> => {
  const api = getRequestApi(ctx);
  const playerId = ctx.query.id as string;
  const [summary, data] = await Promise.all([
    api.playerApi.playerControllerPlayerSummary(playerId),
    Promise.all(load(api, playerId)),
  ]);
  return { playerId, summary, data };
};
