import {
  DotaGameMode,
  DotaMap,
  DotaPatch,
  MatchmakingMode,
} from "@/api/mapped-models";
import { formatDotaMap, formatDotaMode, formatGameMode } from "@/util/gamemode";
import heroes from "@/util/texts/heroes";

export const DotaMapOptions = [
  DotaMap.DOTA,
  DotaMap.DOTA681,
  DotaMap.DIRETIDE,
  DotaMap.DOTA_AUTUMN,
  DotaMap.DOTA_WINTER,
].map((dm) => ({
  label: formatDotaMap(dm),
  value: dm,
}));

export const DotaPatchOptions = [
  DotaPatch.DOTA_684,
  DotaPatch.DOTA_684_TURBO,
].map((dm) => ({
  label: dm,
  value: dm,
}));

export const DotaGameModeOptions = [
  DotaGameMode.ALLPICK,
  DotaGameMode.RANKED_AP,
  DotaGameMode.ALL_RANDOM,
  DotaGameMode.SINGLE_DRAFT,
  DotaGameMode.RANDOM_DRAFT,
  DotaGameMode.CAPTAINS_MODE,
  DotaGameMode.ABILITY_DRAFT,
  DotaGameMode.SOLOMID,
  DotaGameMode.MID_ONLY,
  DotaGameMode.GREEVILING,
  DotaGameMode.DIRETIDE,
  DotaGameMode.ARDM,
].map((gm) => ({
  label: formatDotaMode(gm),
  value: gm,
}));
export const GameModeOptions = [
  { value: "undefined", label: "Все режимы" },
  ...[
    // MatchmakingMode.RANKED,
    MatchmakingMode.UNRANKED,
    MatchmakingMode.SOLOMID,
    MatchmakingMode.BOTS2X2,
    MatchmakingMode.BOTS,
  ].map((it) => ({
    value: it.toString(),
    label: formatGameMode(it),
  })),
];

export const HeroOptions = [
  { value: "undefined", label: "Все герои" },
  ...heroes
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((it) => ({
      value: it.tag,
      label: it.name,
    })),
];
