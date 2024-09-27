import { QueueHolder } from "@/store/queue/QueueStore";
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";

export const DefaultQueueHolder: QueueHolder = {};

export const MatchmakingModes = [
  MatchmakingMode.SOLOMID,
  MatchmakingMode.RANKED,
  MatchmakingMode.UNRANKED,
  MatchmakingMode.DIRETIDE,
  MatchmakingMode.ABILITY_DRAFT,
  MatchmakingMode.GREEVILING,
  MatchmakingMode.BOTS,
  MatchmakingMode.HIGHROOM,
  MatchmakingMode.CAPTAINS_MODE,
];

MatchmakingModes.forEach((mode) => {
  DefaultQueueHolder[JSON.stringify({ mode, version: Dota2Version.Dota_681 })] =
    0;
  DefaultQueueHolder[JSON.stringify({ mode, version: Dota2Version.Dota_684 })] =
    0;
});
