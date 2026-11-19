import { TournamentBracketInfoDto, TournamentDto } from "@/api/back";
import { SectionBlock } from "@/components/SectionBlock";
import React from "react";
import c from "./TournamentStyles.module.scss";
import { AppRouter } from "@/route";
import { PageLink } from "@/components/PageLink";
import { fetchTournamentBracket } from "@/util/fetch-tournament-bracket";
import { BracketRenderer } from "@/containers/BracketRenderer";
import { mapBracket } from "@/containers/BracketRenderer/mapper";
import { NextPageContext } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getRequestApi } from "@/api/request-api";

interface Props {
  tournament: TournamentDto;
  bracket: TournamentBracketInfoDto;
}

export default function TournamentBracketPage({ tournament, bracket }: Props) {
  return (
    <>
      <PageHeader
        breadcrumbs={
          <>
            <PageLink link={AppRouter.admin.tournament.index.link}>
              Турниры
            </PageLink>
            <PageLink
              link={AppRouter.admin.tournament.tournament(tournament.id).link}
            >
              {tournament.name}
            </PageLink>
            <span>Сетка</span>
          </>
        }
      />
      <SectionBlock className={c.block} title={"Сетка"}>
        <BracketRenderer
          admin
          uniqueId={"admin-bracket"}
          bracket={mapBracket(bracket)}
        />
      </SectionBlock>
    </>
  );
}

TournamentBracketPage.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const id = Number(ctx.query.id as string);

  return {
    tournament: await api.tournament.tournamentControllerGetTournament(id),
    bracket: await fetchTournamentBracket(id),
  };
};
