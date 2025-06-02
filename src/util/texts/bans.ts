import { BanReason } from "@/api/mapped-models";

const s: Record<BanReason, string> = {
  [BanReason.GAME_DECLINE]: "Отклонял игры",
  [BanReason.INFINITE_BAN]: "Без объяснений",
  [BanReason.LOAD_FAILURE]: "Не загрузился",
  [BanReason.ABANDON]: "Покидал игры",
  [BanReason.RULE_VIOLATION]: "Нарушение правил",
};

export const formatBanReason = (reason: BanReason): string => {
  return s[reason];
};
