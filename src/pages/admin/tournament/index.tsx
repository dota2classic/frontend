import { TournamentDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";
import { TournamentCard } from "@/components/TournamentCard";
import { Button } from "@/components/Button";
import { SectionBlock } from "@/components/SectionBlock";
import c from "../AdminStyles.module.scss";
import cx from "clsx";

interface Props {
  tournaments: TournamentDto[];
}

export default function TournamentList({ tournaments }: Props) {
  return (
    <div className={cx(c.gap12, c.col)}>
      <SectionBlock title="Действия" variant="simple">
        <Button pageLink={AppRouter.admin.tournament.create.link}>
          Создать турнир
        </Button>
      </SectionBlock>
      <SectionBlock title="Турниры" variant="simple">
        {tournaments.map((t) => (
          <TournamentCard
            key={t.id}
            tournament={t}
            link={AppRouter.admin.tournament.tournament(t.id).link}
          />
        ))}
      </SectionBlock>
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
