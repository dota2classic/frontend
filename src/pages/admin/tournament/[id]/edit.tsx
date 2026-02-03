import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { TournamentDto } from "@/api/back";
import { EditTournament } from "@/containers/EditTournament";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import React from "react";
import { NextPageContext } from "next";

interface Props {
  tournament: TournamentDto;
}

export default function TournamentEditAdminPage(p: Props) {
  return (
    <>
      <Breadcrumbs>
        <PageLink link={AppRouter.admin.tournament.index.link}>
          Турниры
        </PageLink>
        <PageLink
          link={AppRouter.admin.tournament.tournament(p.tournament.id).link}
        >
          {p.tournament.name}
        </PageLink>
        <span>Редактирование</span>
      </Breadcrumbs>
      <EditTournament tournament={p.tournament} />
    </>
  );
}

TournamentEditAdminPage.getInitialProps = async (ctx: NextPageContext) => {
  const id = Number(ctx.query.id as string);

  return {
    tournament: await withTemporaryToken(ctx, () =>
      getApi().tournament.tournamentControllerGetTournament(id),
    ),
  };
};
