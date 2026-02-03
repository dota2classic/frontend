import { getApi } from "@/api/hooks";
import { TournamentBracketInfoDto } from "@/api/back";
import { useEffect, useState } from "react";

export const fetchTournamentBracket = async (id: number) => {
  const ctx = getApi().tournament.tournamentControllerGetBracketContext({
    id,
  });
  // @ts-ignore
  return (
    getApi()
      // @ts-ignore
      .tournament.request(ctx)
      .then((response) => response.json())
  );
};

export const useTournamentBracket = (id: number) => {
  const [data, setData] = useState<TournamentBracketInfoDto | undefined>();
  useEffect(() => {
    fetchTournamentBracket(id).then(setData).catch();
  }, [id]);
  return data;
};
