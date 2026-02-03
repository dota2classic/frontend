import { mapBracket } from "@/containers/BracketRenderer/mapper";
import { BracketRenderer } from "@/containers/BracketRenderer";
import React from "react";
import { getApi } from "@/api/hooks";
import { fetchTournamentBracket } from "@/util/fetch-tournament-bracket";
import { TournamentBracketInfoDto, TournamentDto } from "@/api/back";
import { TournamentTabs } from "@/components/TournamentTabs";
import c from "./TournamentStyles.module.scss";
import { NextPageContext } from "next";

interface Props {
  id: number;
  tournament: TournamentDto;
  bracket: TournamentBracketInfoDto;
}
export default function TournamentBracket({ id, tournament, bracket }: Props) {
  const hasBracket = bracket.stage.length > 0;

  return (
    <>
      <TournamentTabs tournament={tournament} />
      {hasBracket ? (
        <BracketRenderer
          uniqueId={`tournament-${id}`}
          bracket={mapBracket(bracket)}
        />
      ) : (
        <div className={c.empty}>
          <h1>Сетка еще сформирована!</h1>
          <h3>Она появится, когда турнир начнется</h3>
        </div>
      )}
    </>
  );
}

TournamentBracket.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  return {
    id,
    tournament: await getApi().tournament.tournamentControllerGetTournament(id),
    bracket: await fetchTournamentBracket(id),
  };
};
