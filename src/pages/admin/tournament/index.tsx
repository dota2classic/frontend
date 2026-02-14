import { TournamentDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";
import { TournamentCard } from "@/components/TournamentCard";
import { Button } from "@/components/Button";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import c from "../AdminStyles.module.scss";
import cx from "clsx";

interface Props {
  tournaments: TournamentDto[];
}

export default function TournamentList({ tournaments }: Props) {
  return (
    <div className={cx(c.gap12, c.col)}>
      <QueuePageBlock simple heading="Действия">
        <Button pageLink={AppRouter.admin.tournament.create.link}>
          Создать турнир
        </Button>
      </QueuePageBlock>
      <QueuePageBlock simple heading="Турниры">
        {tournaments.map((t) => (
          <PageLink
            link={AppRouter.admin.tournament.tournament(t.id).link}
            key={t.id}
          >
            <TournamentCard tournament={t} />
          </PageLink>
        ))}
      </QueuePageBlock>
    </div>
  );
}

TournamentList.getInitialProps = async (ctx: NextPageContext) => {
  return {
    tournaments: await withTemporaryToken(ctx, () =>
      getApi().tournament.tournamentControllerListTournaments(),
    ),
  };
};
