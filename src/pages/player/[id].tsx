import {MatchHistoryTable, PlayerMatchTable} from "@/components";
import { Matches } from "@/mock/matches";


const d2: any[] = Matches.map((it) => ({
  hero: it.radiant[0].hero,
  kills: it.radiant[0].kills,
  deaths: it.radiant[0].deaths,
  assists: it.radiant[0].assists,
  duration: it.duration,
  timestamp: it.timestamp,
  won: it.winner === 2,
  level: it.radiant[0].level,
  mode: it.mode,
  matchId: it.id,
}));

export default function PlayerPage() {
  return (
    <>
      <PlayerMatchTable data={d2} />
    </>
  );
}
