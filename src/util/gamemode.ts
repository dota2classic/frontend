import { PlayerAspect, Role } from "@/api/mapped-models";

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
