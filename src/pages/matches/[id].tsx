import { NextPageContext } from "next";
import React from "react";
import {
  LiveMatchPreview,
  MatchSummary,
  MatchTeamTable,
  Thread,
  Typography,
} from "@/components";
import { FaTrophy } from "react-icons/fa";
import { useApi } from "@/api/hooks";
import { LiveMatchDto, MatchDto } from "@/api/back";
import Head from "next/head";
import { ThreadType } from "@/api/mapped-models/ThreadType";

interface InitialProps {
  matchId: number;
  preloadedMatch: MatchDto | undefined;
  liveMatches: LiveMatchDto[];
}

export default function MatchPage({
  matchId,
  preloadedMatch,
  liveMatches,
}: InitialProps) {
  const { data: match } = useApi().matchApi.useMatchControllerMatch(matchId, {
    fallbackData: preloadedMatch,
    isPaused() {
      return !!preloadedMatch;
    },
  });

  const isMatchLive =
    liveMatches.findIndex((t) => t.matchId === matchId) !== -1;

  // const liveMatch = useEventSource<LiveMatchDto>(
  //   useApi().liveApi.liveMatchControllerLiveMatchContext({ id: matchId }),
  //   LiveMatchDtoFromJSON.bind(null),
  // );
  const liveMatch = undefined;

  // const thread = useThread("a2a88589-3293-4090-8652-2e4d16aa6882")

  if (match)
    return (
      <>
        <Head>
          <title>{`Матч ${matchId}`}</title>
        </Head>
        <MatchSummary
          radiantKills={match.radiant.reduce((a, b) => a + b.kills, 0)}
          direKills={match.dire.reduce((a, b) => a + b.kills, 0)}
          winner={match.winner}
          matchId={match.id}
          duration={match.duration}
          timestamp={match.timestamp}
          mode={match.mode}
        />

        <Typography.Header radiant>
          Силы Света {match.winner === 2 && <FaTrophy color={"white"} />}
        </Typography.Header>
        <MatchTeamTable duration={match.duration} players={match.radiant} />
        <br />

        <Typography.Header dire>
          Силы Тьмы {match.winner === 3 && <FaTrophy color={"white"} />}
        </Typography.Header>
        <MatchTeamTable duration={match.duration} players={match.dire} />

        <br/>
        <br/>
        <Thread small id={match.id} threadType={ThreadType.MATCH} />
      </>
    );

  // if no match, maybe it live?
  if (isMatchLive && liveMatch) return <LiveMatchPreview match={liveMatch} />;

  return null;
}

MatchPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const matchId = parseInt(ctx.query.id as string);
  const [match, liveList] = await Promise.all<any>([
    await useApi()
      .matchApi.matchControllerMatch(matchId)
      .catch(() => undefined),
    useApi().liveApi.liveMatchControllerListMatches(),
  ]);

  return {
    matchId,
    preloadedMatch: match,
    liveMatches: liveList,
  };
};
