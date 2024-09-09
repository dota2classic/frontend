import {MatchHistoryTable, PlayerMatchTable} from "@/components";
import { Matches } from "@/mock/matches";
import {useApi} from "@/api/hooks";
import {useQueryBackedParameter} from "@/util/hooks";



export default function Home() {
  const [page, setPage] = useQueryBackedParameter("page", 0);
  const { data: matches } = useApi().matchApi.useMatchControllerMatches(page || 0);
  const data = (matches?.data || []);

  return (
    <>
      <MatchHistoryTable data={data} />
    </>
  );
}
