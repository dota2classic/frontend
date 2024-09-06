import { Matches } from "@/mock/matches";
import { NextPageContext } from "next";
import React from "react";
import { MatchTeamTable, Typography } from "@/components";
import { FaTrophy } from "react-icons/fa";

interface InitialProps {
  matchId: number;
}

export default function MatchPage({ matchId }: InitialProps) {
  const match = Matches.find((it) => it.id === matchId)!!;
  return (
    <>
      <Typography.Header radiant>
        Radiant {match.winner === 2 && <FaTrophy color={"white"} />}
      </Typography.Header>
      <MatchTeamTable players={match.radiant} />
      <br />

      <Typography.Header dire>
        Dire {match.winner === 3 && <FaTrophy color={"white"} />}
      </Typography.Header>
      <MatchTeamTable players={match.dire} />
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
