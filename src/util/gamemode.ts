import {MatchmakingMode} from "@/const/enums";

const messages = {
  // MatchmakingMode.TOURNAMENT
  [MatchmakingMode.TOURNAMENT]: "Турнир 5х5",
  // MatchmakingMode.TOURNAMENT_SOLOMID
  [MatchmakingMode.TOURNAMENT_SOLOMID]: "Турнир 1x1",
  // MatchmakingMode.RANKED
  [MatchmakingMode.RANKED]: "Рейтинг",
  // MatchmakingMode.UNRANKED
  [MatchmakingMode.UNRANKED]: "Обычная",
  // MatchmakingMode.SOLOMID
  [MatchmakingMode.SOLOMID]: "1x1 мид",
  // MatchmakingMode.ABILITY_DRAFT
  [MatchmakingMode.ABILITY_DRAFT]: "Ability draft",
  // MatchmakingMode.DIRETIDE
  [MatchmakingMode.DIRETIDE]: "Diretide",
  // MatchmakingMode.HIGHROOM
  [MatchmakingMode.HIGHROOM]: "High room",
  // MatchmakingMode.BOTS
  [MatchmakingMode.BOTS]: "Обычная(новички)",
  // MatchmakingMode.GREEVILING
  [MatchmakingMode.GREEVILING]: "Гряволы",
  // MatchmakingMode.CAPTAINS_MODE
  [MatchmakingMode.CAPTAINS_MODE]: "Captains Mode",
};


export enum Dota2Version {
  Dota_681 = "Dota_681",
  Dota_678 = "Dota_678",
  Dota_684 = "Dota_684",
}

export function formatGameMode (mode: any) {
  return messages[mode as MatchmakingMode] as any;
};
