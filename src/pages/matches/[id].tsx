import { NextPageContext } from "next";
import React from "react";
import { getApi } from "@/api/hooks";
import { LiveMatchDto, MatchDto } from "@/api/back";
import { MatchPageContainer } from "@/containers";

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
  return (
    <MatchPageContainer
      matchId={matchId}
      liveMatches={liveMatches}
      preloadedMatch={preloadedMatch}
    />
  );
}

MatchPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const matchId = parseInt(ctx.query.id as string);
  const [match, liveList] = await Promise.combine([
    getApi()
      .matchApi.matchControllerMatch(matchId)
      .catch(() => undefined),
    getApi().liveApi.liveMatchControllerListMatches(),
  ]);

  return {
    matchId,
    preloadedMatch: match,
    liveMatches: liveList,
  };
};
