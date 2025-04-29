import { BanReason } from "@/api/mapped-models";

const s: Record<BanReason, string> = {
  [BanReason.GAME_DECLINE]: "Отклонял игры",
  [BanReason.INFINITE_BAN]: "Без объяснений",
  [BanReason.REPORTS]: "Репорты: руин",
  [BanReason.LOAD_FAILURE]: "Не загрузился",
  [BanReason.ABANDON]: "Покидал игры",
  [BanReason.LEARN2PLAY]: "Нужно учиться играть",
};

export const formatBanReason = (reason: BanReason): string => {
  return s[reason];
};
