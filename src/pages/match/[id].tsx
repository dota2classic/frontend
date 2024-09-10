import { NextPageContext } from "next";
import React from "react";
import { MatchSummary, MatchTeamTable, Typography } from "@/components";
import { FaTrophy } from "react-icons/fa";
import { useApi } from "@/api/hooks";
import { MatchDto } from "@/api/back";
import Head from "next/head";

interface InitialProps {
  matchId: number;
  preloadedMatch?: MatchDto;
}

export default function MatchPage({ matchId, preloadedMatch }: InitialProps) {
  const { data: match } = useApi().matchApi.useMatchControllerMatch(matchId, {
    fallbackData: preloadedMatch,
    isPaused() {
      return !!preloadedMatch;
    },
  });

  if (!match) return null;

  return (
    <>
      <Head>
        <title>Матч {matchId}</title>
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
    </>
  );
}

MatchPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const matchId = parseInt(ctx.query.id as string);
  const match = await useApi().matchApi.matchControllerMatch(matchId);
  return {
    matchId,
    preloadedMatch: match,
  };
};
