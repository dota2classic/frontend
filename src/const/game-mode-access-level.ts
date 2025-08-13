import { GamemodeAccessMap, MatchmakingMode } from "@/api/back";

export enum GameModeAccessLevel {
  NOTHING = 0,
  EDUCATION = 1,
  SIMPLE_MODES = 2,
  HUMAN_GAMES = 3,
}

export const getGameModeAccessLevelForMap = (
  map: GamemodeAccessMap,
): GameModeAccessLevel => {
  if (map.humanGames) return GameModeAccessLevel.HUMAN_GAMES;
  if (map.simpleModes) return GameModeAccessLevel.SIMPLE_MODES;
  if (map.education) return GameModeAccessLevel.EDUCATION;
  return GameModeAccessLevel.NOTHING;
};

export const getRequiredAccessLevel = (
  mode: MatchmakingMode,
): GameModeAccessLevel => {
  switch (mode) {
    case MatchmakingMode.RANKED:
      return GameModeAccessLevel.HUMAN_GAMES;
    case MatchmakingMode.UNRANKED:
      return GameModeAccessLevel.HUMAN_GAMES;
    case MatchmakingMode.SOLOMID:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.DIRETIDE:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.GREEVILING:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.ABILITY_DRAFT:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.TOURNAMENT:
      return GameModeAccessLevel.HUMAN_GAMES;
    case MatchmakingMode.BOTS:
      return GameModeAccessLevel.EDUCATION;
    case MatchmakingMode.HIGHROOM:
      return GameModeAccessLevel.HUMAN_GAMES;
    case MatchmakingMode.TOURNAMENT_SOLOMID:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.CAPTAINS_MODE:
      return GameModeAccessLevel.HUMAN_GAMES;
    case MatchmakingMode.LOBBY:
      return GameModeAccessLevel.NOTHING;
    case MatchmakingMode.BOTS2X2:
      return GameModeAccessLevel.SIMPLE_MODES;
    case MatchmakingMode.TURBO:
      return GameModeAccessLevel.SIMPLE_MODES;
  }
};
