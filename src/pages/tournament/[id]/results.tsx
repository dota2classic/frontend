import React from "react";
import { getApi } from "@/api/hooks";
import { StageStandingsDto, TournamentDto } from "@/api/back";
import { TournamentTabs } from "@/components/TournamentTabs";
import { EmptyState } from "@/components/EmptyState";
import c from "@/pages/tournament/[id]/TournamentStyles.module.scss";
import { NextPageContext } from "next";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { RankStandingCard } from "@/components/RankStandingCard";

interface Props {
  id: number;
  tournament: TournamentDto;
  results: StageStandingsDto[];
}

export default function TournamentMatches({ tournament, results }: Props) {
  const hasStandings = results.length > 0 && results[0].standings.length > 0;

  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("tournament.seo.matches.title", { name: tournament.name })}
        description={t("tournament.seo.matches.description", {
          name: tournament.name,
        })}
      />
      <TournamentTabs tournament={tournament} />
      {hasStandings ? (
        <div className={c.matches}>
          {results[0].standings.map((m) => (
            <RankStandingCard
              key={m.participant.id}
              participant={m.participant}
              rank={m.rank}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className={c.empty}
          description={t("tournament.common.matchesWhenStart")}
          title={t("tournament.common.bracketNotReady")}
        />
      )}
    </>
  );
}

TournamentMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  return {
    id,
    tournament: await getApi().tournament.tournamentControllerGetTournament(id),
    results: await getApi().tournament.tournamentControllerGetStandings(id),
  };
};
