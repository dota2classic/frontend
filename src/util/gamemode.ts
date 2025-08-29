import { DotaMap, PlayerAspect, Role } from "@/api/mapped-models";
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
