import { LiveMatchPreview } from "@/components";
import { Matches } from "@/mock/matches";
import { LiveMatchDto, LiveMatchDtoFromJSON } from "@/api/back";
import { useApi } from "@/api/hooks";
import { useEventSource } from "@/util/hooks";

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

export default function Home() {
  const liveMatch = useEventSource<LiveMatchDto>(
    useApi().liveApi.liveMatchControllerLiveMatchContext({ id: 15624 }),
    LiveMatchDtoFromJSON.bind(null),
  );
  return (
    <>
      {(liveMatch && <LiveMatchPreview match={liveMatch} />) ||
        "No live match yet"}
    </>
  );
}
