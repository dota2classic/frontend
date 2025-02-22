import { NextPageContext } from "next";
import { PlayerRecordsResponse, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps, PlayerSummary, Section } from "@/components";
import React from "react";
import { PlayerRecords } from "@/containers";

interface Props {
  preloadedSummary: PlayerSummaryDto;
  records: PlayerRecordsResponse;
}

export default function PlayerRecordsPage({
  records,
  preloadedSummary,
}: Props) {
  return (
    <>
      <EmbedProps
        title={`${preloadedSummary.user.name} история матчей`}
        description={`История матчей игрока ${preloadedSummary.user.name}. Список игр сыгранных в старую доту`}
      />

      <PlayerSummary
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rank={preloadedSummary.rank}
        mmr={preloadedSummary.mmr}
        image={preloadedSummary.user.avatar || "/avatar.png"}
        name={preloadedSummary.user.name}
        steamId={preloadedSummary.user.steamId}
      />

      <Section>
        <PlayerRecords records={records} />
      </Section>
    </>
  );
}

PlayerRecordsPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  const [preloadedSummary, records] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().record.recordControllerPlayerRecords(playerId),
  ]);

  return {
    preloadedSummary,
    records,
  };
};
