import {PlayerMatchItem} from "@/components/PlayerMatchTable/PlayerMatchTable";
import {MatchDto, PlayerInMatchDto} from "@/api/back";

export const matchToPlayerMatchItem = (it: MatchDto, predicate: (plr: PlayerInMatchDto) => boolean): PlayerMatchItem => {
  const thisPlayer = [...it.radiant, ...it.dire].find(predicate)!;
  return {
    matchId: it.id,
    hero: thisPlayer.hero,
    kills: thisPlayer.kills,
    deaths: thisPlayer.deaths,
    assists: thisPlayer.assists,
    duration: it.duration,
    timestamp: it.timestamp,
    level: thisPlayer.level,
    won: thisPlayer.team === it.winner,
    mode: it.mode as any,
  };

}
