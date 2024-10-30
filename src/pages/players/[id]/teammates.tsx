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
import { getApi } from "@/api/hooks";
import { maxBy } from "@/util/iter";

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
  const [totalData, setTotalData] = useState<
    Record<number, PlayerTeammatePageDto>
  >({
    [preloadedTeammates.page]: preloadedTeammates,
  });
  const [reachedBottom, setReachedBottom] = useState(false);

  const onScrollToEnd = async () => {
    if (reachedBottom) return;

    const maxPage = maxBy(Object.values(totalData), (it) => it.page)!.page;
    const data = await getApi().playerApi.playerControllerTeammates(
      playerId,
      maxPage + 1,
    );
    if (data.data.length === 0) {
      setReachedBottom(true);
      return;
    }

    setTotalData({
      ...totalData,
      [data.page]: data,
    });
  };

  return (
    <>
      <PlayerSummary
        image={summary.user.avatar}
        name={summary.user.name}
        steamId={summary.user.steamId}
        wins={summary.wins}
        loss={summary.loss}
        rank={summary.rank}
        mmr={summary.mmr}
      />
      <Section>
        <header>Тиммейты</header>
        <TeammatesTable
          data={Object.values(totalData).flatMap((it) => it.data)}
        />
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
    summary: await getApi().playerApi.playerControllerPlayerSummary(playerId),
    preloadedTeammates: await getApi().playerApi.playerControllerTeammates(
      playerId,
      page,
      undefined,
    ),
    playerId,
  };
};
