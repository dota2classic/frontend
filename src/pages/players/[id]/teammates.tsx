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
import { maxBy } from "@/util";
import { GSSProps } from "@/misc";
import { cachedBackendRequest } from "@/util/cached-backend-request";

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

// eslint-disable-next-line react-refresh/only-export-components
export async function getServerSideProps(
  ctx: NextPageContext,
): Promise<GSSProps<Props>> {
  const playerId = ctx.query.id as string;

  const page = numberOrDefault(ctx.query.page, 0);

  const dataFetch = () =>
    Promise.combine([
      getApi().playerApi.playerControllerPlayerSummary(playerId),
      getApi().playerApi.playerControllerTeammates(playerId, page, undefined),
    ]);
  const [summary, preloadedTeammates] = await cachedBackendRequest(
    dataFetch,
    "player_profile__teammates",
    [playerId],
    60_000 * 5, // 5 minutes cache
  );
  return {
    props: {
      summary,
      preloadedTeammates,
      playerId,
    },
  };
}
