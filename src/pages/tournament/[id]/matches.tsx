import React from "react";
import { getApi } from "@/api/hooks";
import { BracketMatchDto, TournamentDto } from "@/api/back";
import { TournamentTabs } from "@/components/TournamentTabs";
import c from "@/pages/tournament/[id]/TournamentStyles.module.scss";
import { TournamentMatchCard } from "@/components/TournamentMatchCard";
import { NextPageContext } from "next";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

interface Props {
  id: number;
  tournament: TournamentDto;
  matches: BracketMatchDto[];
}

export default function TournamentMatches({ tournament, matches }: Props) {
  const hasBracket = matches.length > 0;
  const sortedMatches = matches.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
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
      {hasBracket ? (
        <div className={c.matches}>
          {sortedMatches.map((m) => (
            <TournamentMatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <div className={c.empty}>
          <h1>{t("tournament.common.bracketNotReady")}</h1>
          <h3>{t("tournament.common.matchesWhenStart")}</h3>
        </div>
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
    matches: await getApi().tournament.tournamentControllerGetMatches(id),
  };
};
