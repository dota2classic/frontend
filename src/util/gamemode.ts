import {
  DotaGameMode,
  DotaGameRulesState,
  DotaMap,
  MatchmakingMode,
  PlayerAspect,
  Role,
} from "@/api/mapped-models";
import { ReactNode } from "react";
import { RecordType } from "@/api/back";

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
  [MatchmakingMode.HIGHROOM]: "Highroom 5х5",
  // MatchmakingMode.BOTS
  [MatchmakingMode.BOTS]: "Против ботов",
  // MatchmakingMode.GREEVILING
  [MatchmakingMode.GREEVILING]: "Гряволы",
  // MatchmakingMode.CAPTAINS_MODE
  [MatchmakingMode.CAPTAINS_MODE]: "Captains Mode",
  [MatchmakingMode.LOBBY]: "Лобби",
  [MatchmakingMode.BOTS2X2]: "2х2 с ботами",
  [MatchmakingMode.TURBO]: "Турбо",
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
  [DotaGameMode.ARDM]: "ARDM",

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

const recordMessages = {
  [RecordType.KILLS]: "Убийств",
  [RecordType.KDA]: "Лучшее KDA",
  [RecordType.ASSISTS]: "Помощи",
  [RecordType.DEATHS]: "Смертей",
  [RecordType.LASTHITS]: "Добитых крипов",
  [RecordType.DENIES]: "Не отданных крипов",
  [RecordType.GPM]: "Золото в минуту",
  [RecordType.XPM]: "Опыт в минуту",
  [RecordType.NETWORTH]: "Общая стоимость",
  [RecordType.TOWERDAMAGE]: "Урон по строениям",
  [RecordType.HERODAMAGE]: "Урон по героям",
  [RecordType.HEROHEALING]: "Лечение",
};

export function formatRecordType(type: RecordType) {
  return recordMessages[type];
}

const aspectMessages = {
  [PlayerAspect.FRIENDLY]: "Добряк",
  [PlayerAspect.TOXIC]: "Токсик",
  [PlayerAspect.TALKATIVE]: "Болтун",
  [PlayerAspect.OPTIMIST]: "Оптимист",
  [PlayerAspect.CLOWN]: "Клоун",
};

export function formatPlayerAspect(type: PlayerAspect) {
  return aspectMessages[type];
}

const roleMessages = {
  [Role.PLAYER]: "Игрок",
  [Role.MODERATOR]: "Модератор",
  [Role.ADMIN]: "Администратор",
  [Role.OLD]: "Бессмертный",
  [Role.HUMAN]: "Человек",
};

export function formatRole(role: Role) {
  return roleMessages[role];
}

const gameModeDescriptions = {
  // MatchmakingMode.TOURNAMENT
  [MatchmakingMode.TOURNAMENT]: "Турнир 5х5",
  // MatchmakingMode.TOURNAMENT_SOLOMID
  [MatchmakingMode.TOURNAMENT_SOLOMID]: "Турнир 1x1",
  // MatchmakingMode.RANKED
  [MatchmakingMode.RANKED]: "Рейтинг",
  // MatchmakingMode.UNRANKED
  [MatchmakingMode.UNRANKED]:
    "Классическая игра 5х5 в рейтинговом режиме All Pick. За победу или поражение меняется рейтинг, который используется для баланса команд в будущих матчах.",
  // MatchmakingMode.SOLOMID
  [MatchmakingMode.SOLOMID]:
    "Игра на центральной линии один на один. Победа засчитывается после двух смертей соперника или уничтожения его первой башни.",
  // MatchmakingMode.ABILITY_DRAFT
  [MatchmakingMode.ABILITY_DRAFT]: "Ability draft",
  // MatchmakingMode.DIRETIDE
  [MatchmakingMode.DIRETIDE]: "Diretide",
  // MatchmakingMode.HIGHROOM
  [MatchmakingMode.HIGHROOM]:
    "Режим для более опытных игроков, которые хотят сыграть спокойную и качественную игру без ливеров. Рейтинг меняется за победы и поражения, а доступ открывается после 30 сыгранных матчей.",
  // MatchmakingMode.BOTS
  [MatchmakingMode.BOTS]:
    "Режим-обучение против ботов. Играйте вместе с другими новичками и одержите победу над ботами, чтобы получить доступ к обычным матчам 5х5.",
  // MatchmakingMode.GREEVILING
  [MatchmakingMode.GREEVILING]: "Гряволы",
  // MatchmakingMode.CAPTAINS_MODE
  [MatchmakingMode.CAPTAINS_MODE]: "Captains Mode",
  [MatchmakingMode.LOBBY]: "Лобби",
  [MatchmakingMode.BOTS2X2]: "2х2 с ботами",
  [MatchmakingMode.TURBO]:
    "Упрощенный режим с быстрыми уровнями и большим количеством золота. Отлично подойдет для обучения или быстрой игры",
};

export function formatGameModeDescription(mode: MatchmakingMode) {
  return gameModeDescriptions[mode];
}
