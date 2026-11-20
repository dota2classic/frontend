import { NextPageContext } from "next";
import React from "react";
import { MatchDto } from "@/api/back";
import { MatchPageContainer } from "@/containers/MatchPageContainer";
import { getRequestApi } from "@/api/request-api";

interface InitialProps {
  matchId: number;
  preloadedMatch: MatchDto | undefined;
  isMatchLive: boolean;
}

export default function MatchPage({
  matchId,
  preloadedMatch,
  isMatchLive,
}: InitialProps) {
  return (
    <MatchPageContainer
      matchId={matchId}
      isMatchLive={isMatchLive}
      preloadedMatch={preloadedMatch}
    />
  );
}

MatchPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const api = getRequestApi(ctx);
  const matchId = parseInt(ctx.query.id as string);
  const match = await api.matchApi
    .matchControllerMatch(matchId)
    .catch(() => undefined);
  const isMatchLive =
    !match &&
    (await api.liveApi.liveMatchControllerListMatches()).some(
      (live) => live.matchId === matchId,
    );

  return {
    matchId,
    preloadedMatch: match,
    isMatchLive,
  };
};
