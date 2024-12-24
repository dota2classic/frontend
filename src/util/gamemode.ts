import {
  DotaGameMode,
  DotaGameRulesState,
  DotaMap,
  MatchmakingMode,
} from "@/api/mapped-models";
import { ReactNode } from "react";

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
  [MatchmakingMode.LOBBY]: "Лобби",
};

export function formatGameMode(mode: MatchmakingMode) {
  return messages[mode];
}

const dotaMessages = {
  [DotaGameMode.ALLPICK]: "All Pick",
  [DotaGameMode.CAPTAINS_MODE]: "Captains Mode",
  [DotaGameMode.RANDOM_DRAFT]: "Random Draft",
  [DotaGameMode.SINGLE_DRAFT]: "Single Draft",
  [DotaGameMode.ALL_RANDOM]: "All Random",
  // ? intro
  [DotaGameMode.INTRO]: "INTRO",

  [DotaGameMode.DIRETIDE]: "Diretide",
  [DotaGameMode.REVERSE_CAPTAINS_MODE]: "Reverse Captains Mode",
  [DotaGameMode.GREEVILING]: "Гряволы",
  [DotaGameMode.TUTORIAL]: "TUTORIAL",
  [DotaGameMode.MID_ONLY]: "Mid only",
  [DotaGameMode.LEAST_PLAYED]: "LEAST_PLAYED",
  [DotaGameMode.LIMITED_HEROES]: "LIMITED_HEROES",
  [DotaGameMode.BALANCED_DRAFT]: "BALANCED_DRAFT",
  [DotaGameMode.ABILITY_DRAFT]: "Ability Draft",

  [DotaGameMode.SOLOMID]: "Solomid",
  [DotaGameMode.RANKED_AP]: "Рейт. All Pick",
};

export function formatDotaMode(mode: DotaGameMode) {
  return dotaMessages[mode];
}

const gameState: Partial<Record<DotaGameRulesState, ReactNode>> = {
  // MatchmakingMode.TOURNAMENT
  [DotaGameRulesState.WAIT_FOR_PLAYERS_TO_LOAD]: "Загрузка игроков",
  [DotaGameRulesState.HERO_SELECTION]: "Выбор героев",
  [DotaGameRulesState.STRATEGY_TIME]: "Выбор героев",
  [DotaGameRulesState.PRE_GAME]: "Начало игры",
  [DotaGameRulesState.GAME_IN_PROGRESS]: "Игра идет",
  [DotaGameRulesState.POST_GAME]: "Игра завершена",
  [DotaGameRulesState.DISCONNECT]: "Ошибка загрузки",
};
export function formatGameState(state: DotaGameRulesState) {
  return gameState[state] || "Неизвестное состояние";
}

const mapName: Partial<Record<DotaMap, ReactNode>> = {
  [DotaMap.DOTA]: "Обычная 6.84",
  [DotaMap.DOTA_WINTER]: "Зимняя",
  [DotaMap.DOTA_AUTUMN]: "Осенняя",
  [DotaMap.DOTA681]: "6.81(старый рошан)",
  [DotaMap.DIRETIDE]: "Diretide",
};
export function formatDotaMap(state: DotaMap) {
  return mapName[state] || "Неизвестная карта";
}
