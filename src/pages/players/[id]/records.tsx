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
        session={preloadedSummary.session}
        banStatus={preloadedSummary.banStatus}
        stats={preloadedSummary.overallStats}
        user={preloadedSummary.user}
        rank={preloadedSummary.seasonStats.rank}
        mmr={preloadedSummary.seasonStats.mmr}
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
