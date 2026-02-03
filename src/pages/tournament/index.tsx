import { TournamentDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { TournamentCard } from "@/components/TournamentCard";

interface Props {
  tournaments: TournamentDto[];
}
export default function TournamentIndex({ tournaments }: Props) {
  return (
    <>
      {tournaments.map((t) => (
        <TournamentCard tournament={t} key={t.id} />
      ))}
    </>
  );
}

TournamentIndex.getInitialProps = async (): Promise<Props> => {
  return {
    tournaments:
      await getApi().tournament.tournamentControllerListTournaments(),
  };
};
