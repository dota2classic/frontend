import { PlayerMatchTable } from "@/components";
import { MatchmakingMode } from "@/const/enums";

const data = new Array(10).fill(null).map((it, index) => ({
  hero: "npc_dota_hero_venomancer",
  kills: 3,
  deaths: 4,
  assists: 6,
  duration: 1234 + (index * 29),
  timestamp: new Date().getTime() - 1000 * (index + 1) * 430,
  level: 3 + index * 2,
  won: index % 2 == 0,
  mode: MatchmakingMode.UNRANKED,
}));

export default function Home() {
  return (
    <>
      <PlayerMatchTable data={data} />
    </>
  );
}
