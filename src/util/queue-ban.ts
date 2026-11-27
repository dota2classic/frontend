import { BanReason } from "@/api/mapped-models";

type QueueBan = { isBanned?: boolean; status?: number } | null | undefined;

export function isSecretQueueBan(ban: QueueBan): boolean {
  return (
    ban?.isBanned === true &&
    (ban.status === BanReason.INFINITE_BAN ||
      ban.status === BanReason.ABANDON ||
      ban.status === BanReason.RULE_VIOLATION)
  );
}

export function isQueueCooldownBan(ban: QueueBan): boolean {
  return (
    ban?.isBanned === true &&
    (ban.status === BanReason.GAME_DECLINE ||
      ban.status === BanReason.LOAD_FAILURE)
  );
}
