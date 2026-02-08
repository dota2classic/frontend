import { mapBracket } from "@/containers/BracketRenderer/mapper";
import { BracketRenderer } from "@/containers/BracketRenderer";
import React from "react";
import { getApi } from "@/api/hooks";
import { fetchTournamentBracket } from "@/util/fetch-tournament-bracket";
import { TournamentBracketInfoDto, TournamentDto } from "@/api/back";
import { TournamentTabs } from "@/components/TournamentTabs";
import c from "./TournamentStyles.module.scss";
import { NextPageContext } from "next";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { usePeriodicRefreshPageProps } from "@/util/usePageProps";

interface Props {
  id: number;
  tournament: TournamentDto;
  bracket: TournamentBracketInfoDto;
}
export default function TournamentBracket({ id, tournament, bracket }: Props) {
  const hasBracket = bracket.stage.length > 0;
  const { t } = useTranslation();
  usePeriodicRefreshPageProps(30_000);
  return (
    <>
      <EmbedProps
        title={t("tournament.seo.bracket.title", { name: tournament.name })}
        description={t("tournament.seo.bracket.description", {
          name: tournament.name,
        })}
      />
      <TournamentTabs tournament={tournament} />
      {hasBracket ? (
        <BracketRenderer
          uniqueId={`tournament-${id}`}
          bracket={mapBracket(bracket)}
        />
      ) : (
        <div className={c.empty}>
          <h1>{t("tournament.common.bracketNotReady")}</h1>
          <h3>{t("tournament.common.matchesWhenStart")}</h3>
        </div>
      )}
    </>
  );
}

TournamentBracket.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  const [tournament, bracket] = await Promise.combine([
    getApi().tournament.tournamentControllerGetTournament(id),
    fetchTournamentBracket(id),
  ]);
  return {
    id,
    tournament,
    bracket,
  };
};
