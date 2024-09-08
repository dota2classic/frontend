import { Matches } from "@/mock/matches";
import { NextPageContext } from "next";
import React from "react";
import { MatchSummary, MatchTeamTable, Typography } from "@/components";
import { FaTrophy } from "react-icons/fa";

interface InitialProps {
  matchId: number;
}

export default function MatchPage({ matchId }: InitialProps) {
  const match = Matches.find((it) => it.id === matchId)!!;
  return (
    <>
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
  return {
    matchId: parseInt(ctx.query.id as string),
  };
};
