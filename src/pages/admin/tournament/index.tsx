import { TournamentDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";

interface Props {
  tournaments: TournamentDto[];
}

export default function TournamentList({ tournaments }: Props) {
  return (
    <>
      <PageLink link={AppRouter.admin.tournament.create.link}>
        Создать турнир
      </PageLink>
      {tournaments.map((t) => (
        <PageLink
          link={AppRouter.admin.tournament.tournament(t.id).link}
          key={t.id}
        >
          {t.name}
        </PageLink>
      ))}
    </>
  );
}

TournamentList.getInitialProps = async (ctx: NextPageContext) => {
  return {
    tournaments: await withTemporaryToken(ctx, () =>
      getApi().tournament.tournamentControllerListTournaments(),
    ),
  };
};
