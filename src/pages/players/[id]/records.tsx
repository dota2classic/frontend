import { NextPageContext } from "next";
import { PlayerRecordsResponse, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps, PlayerSummary, Section } from "@/components";
import React from "react";
import { PlayerRecords } from "@/containers";
import { GSSProps } from "@/misc";
import { cachedBackendRequest } from "@/util/cached-backend-request";

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

// eslint-disable-next-line react-refresh/only-export-components
export async function getServerSideProps(
  ctx: NextPageContext,
): Promise<GSSProps<Props>> {
  const playerId = ctx.query.id as string;
  const dataFetch = () =>
    Promise.combine([
      getApi().playerApi.playerControllerPlayerSummary(playerId),
      getApi().record.recordControllerPlayerRecords(playerId),
    ]);
  const [preloadedSummary, records] = await cachedBackendRequest(
    dataFetch,
    "player_profile__records",
    [playerId],
    60_000 * 5, // 5 minutes cache
  );

  return {
    props: {
      preloadedSummary,
      records,
    },
  };
}
