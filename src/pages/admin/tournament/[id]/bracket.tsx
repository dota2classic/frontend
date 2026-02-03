import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { TournamentBracketInfoDto, TournamentDto } from "@/api/back";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import React from "react";
import c from "./TournamentStyles.module.scss";
import { AppRouter } from "@/route";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";
import { fetchTournamentBracket } from "@/util/fetch-tournament-bracket";
import { BracketRenderer } from "@/containers/BracketRenderer";
import { mapBracket } from "@/containers/BracketRenderer/mapper";
import { NextPageContext } from "next";

interface Props {
  tournament: TournamentDto;
  bracket: TournamentBracketInfoDto;
}

export default function TournamentBracketPage({ tournament, bracket }: Props) {
  return (
    <>
      <Breadcrumbs>
        <PageLink link={AppRouter.admin.tournament.index.link}>
          Турниры
        </PageLink>
        <PageLink
          link={AppRouter.admin.tournament.tournament(tournament.id).link}
        >
          {tournament.name}
        </PageLink>
        <span>Сетка</span>
      </Breadcrumbs>
      <QueuePageBlock className={c.block} heading={"Сетка"}>
        <BracketRenderer
          admin
          uniqueId={"admin-bracket"}
          bracket={mapBracket(bracket)}
        />
      </QueuePageBlock>
    </>
  );
}

TournamentBracketPage.getInitialProps = async (ctx: NextPageContext) => {
  const id = Number(ctx.query.id as string);

  return {
    tournament: await withTemporaryToken(ctx, () =>
      getApi().tournament.tournamentControllerGetTournament(id),
    ),
    bracket: await fetchTournamentBracket(id),
  };
};
