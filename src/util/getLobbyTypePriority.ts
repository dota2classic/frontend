import { MatchmakingMode } from "@/api/mapped-models";

export const getLobbyTypePriority = (type: MatchmakingMode): number => {
  let score = Number(type);

  if (type === MatchmakingMode.UNRANKED) {
    score -= 1000;
  } else if (type === MatchmakingMode.HIGHROOM) {
    score -= 500;
  } else if (type === MatchmakingMode.BOTS2X2) {
    score -= 100;
  }
  return score;
};
