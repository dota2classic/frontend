import { NextPageContext } from "next";
import React from "react";
import { DroppedItemDto, PlayerSummaryDto, TradeUserDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps, PlayerSummary } from "@/components";
import { DropList } from "@/containers";
import { withTemporaryToken } from "@/util/withTemporaryToken";

interface Props {
  steamId: string;
  drops: DroppedItemDto[];
  summary: PlayerSummaryDto;
  user: TradeUserDto;
}

export default function PlayerDrops({ drops, summary, user }: Props) {
  return (
    <>
      <EmbedProps
        description={"Настройки полученных предметов"}
        title={"Предметы"}
      />
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />

      <DropList drops={drops} summary={summary} user={user} />
    </>
  );
}

PlayerDrops.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const steamId = ctx.query.id as string;
  const [summary, drops, user] = await withTemporaryToken(ctx, () =>
    Promise.combine([
      getApi().playerApi.playerControllerPlayerSummary(steamId),
      getApi().drops.itemDropControllerGetMyDrops(),
      getApi().drops.itemDropControllerGetUser(),
    ]),
  );

  return {
    drops,
    summary,
    user,
    steamId,
  };
};
