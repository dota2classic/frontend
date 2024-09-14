import { NextPageContext } from "next";
import { numberOrDefault } from "@/util/urls";
import {
  PlayerSummary,
  ScrollDetector,
  Section,
  TeammatesTable,
} from "@/components";
import React, { useState } from "react";
import { PlayerSummaryDto, PlayerTeammatePageDto } from "@/api/back";
import { useApi } from "@/api/hooks";

interface Props {
  summary: PlayerSummaryDto;
  preloadedTeammates: PlayerTeammatePageDto;
  playerId: string;
}

export default function PlayerTeammates({
  preloadedTeammates,
  playerId,
  summary,
}: Props) {
  const [totalData, setTotalData] = useState<PlayerTeammatePageDto[]>([
    preloadedTeammates,
  ]);
  const [reachedBottom, setReachedBottom] = useState(false);

  const onScrollToEnd = async () => {
    if (reachedBottom) return;

    const data = await useApi().playerApi.playerControllerTeammates(
      playerId,
      totalData.length,
    );
    if (data.data.length === 0) {
      setReachedBottom(true);
      return;
    }
    setTotalData([...totalData, data!]);
  };

  return (
    <>
      <PlayerSummary
        image={summary.avatar}
        name={summary.name}
        steamId={summary.steamId}
        wins={summary.wins}
        loss={summary.loss}
        rank={summary.rank}
        mmr={summary.mmr}
      />
      <Section>
        <header>Тиммейты</header>
        <TeammatesTable data={totalData.flatMap((it) => it.data)} />
        <ScrollDetector onScrolledTo={onScrollToEnd} />
      </Section>
    </>
  );
}

PlayerTeammates.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  const page = numberOrDefault(ctx.query.page, 0);

  return {
    summary: await useApi().playerApi.playerControllerPlayerSummary(playerId),
    preloadedTeammates: await useApi().playerApi.playerControllerTeammates(
      playerId,
      page,
      undefined,
    ),
    playerId,
  };
};
