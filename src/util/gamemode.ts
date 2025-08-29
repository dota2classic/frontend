import {
  DotaMap,
  MatchmakingMode,
  PlayerAspect,
  Role,
} from "@/api/mapped-models";
import { ReactNode } from "react";

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
