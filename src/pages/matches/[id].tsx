import { NextPageContext } from "next";
import React from "react";
import { LiveMatchDto, MatchDto } from "@/api/back";
import { MatchPageContainer } from "@/containers/MatchPageContainer";
import { getRequestApi } from "@/api/request-api";

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
  const api = getRequestApi(ctx);
  const matchId = parseInt(ctx.query.id as string);
  const [match, liveList] = await Promise.combine([
    api.matchApi.matchControllerMatch(matchId).catch(() => undefined),
    api.liveApi.liveMatchControllerListMatches(),
  ]);

  return {
    matchId,
    preloadedMatch: match,
    liveMatches: liveList,
  };
};
