import { MatchmakingMode } from "@/api/mapped-models";

const messages = {
  // MatchmakingMode.TOURNAMENT
  [MatchmakingMode.TOURNAMENT]: "Турнир 5х5",
  // MatchmakingMode.TOURNAMENT_SOLOMID
  [MatchmakingMode.TOURNAMENT_SOLOMID]: "Турнир 1x1",
  // MatchmakingMode.RANKED
  [MatchmakingMode.RANKED]: "Рейтинг",
  // MatchmakingMode.UNRANKED
  [MatchmakingMode.UNRANKED]: "Обычная 5x5",
  // MatchmakingMode.SOLOMID
  [MatchmakingMode.SOLOMID]: "1x1 мид",
  // MatchmakingMode.ABILITY_DRAFT
  [MatchmakingMode.ABILITY_DRAFT]: "Ability draft",
  // MatchmakingMode.DIRETIDE
  [MatchmakingMode.DIRETIDE]: "Diretide",
  // MatchmakingMode.HIGHROOM
  [MatchmakingMode.HIGHROOM]: "High room",
  // MatchmakingMode.BOTS
  [MatchmakingMode.BOTS]: "Обучение",
  // MatchmakingMode.GREEVILING
  [MatchmakingMode.GREEVILING]: "Гряволы",
  // MatchmakingMode.CAPTAINS_MODE
  [MatchmakingMode.CAPTAINS_MODE]: "Captains Mode",
};

export function formatGameMode(mode: MatchmakingMode) {
  return messages[mode];
}
