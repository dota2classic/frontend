import { TournamentDto, TournamentStatus } from "@/api/back";
import { getApi } from "@/api/hooks";
import { TournamentCard } from "@/components/TournamentCard";
import c from "./[id]/TournamentStyles.module.scss";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

interface Props {
  tournaments: TournamentDto[];
}
export default function TournamentIndex({ tournaments }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("tournament.seo.list.title")}
        description={t("tournament.seo.list.description")}
      />
      <div className={c.matches}>
        {tournaments
          .sort((a, b) => b.id - a.id)
          .filter((it) => it.status !== TournamentStatus.DRAFT)
          .map((t) => (
            <TournamentCard tournament={t} key={t.id} />
          ))}
      </div>
    </>
  );
}

TournamentIndex.getInitialProps = async (): Promise<Props> => {
  return {
    tournaments:
      await getApi().tournament.tournamentControllerListTournaments(),
  };
};
