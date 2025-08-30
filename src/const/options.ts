import {
  DotaGameMode,
  DotaMap,
  DotaPatch,
  MatchmakingMode,
} from "@/api/mapped-models";
import heroes from "@/util/texts/heroes";
import { Region } from "@/api/back";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";

const DotaMapOptions = [
  DotaMap.DOTA,
  DotaMap.DOTA681,
  DotaMap.DIRETIDE,
  DotaMap.DOTA_AUTUMN,
  DotaMap.DOTA_WINTER,
].map((dm) => ({
  label: `dota_map.${dm}` as TranslationKey,
  value: dm,
}));

export const useDotaMapOptions = () => {
  const { t } = useTranslation();
  return DotaMapOptions.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));
};

export const DotaPatchOptions = [
  DotaPatch.DOTA_684,
  DotaPatch.DOTA_684_TURBO,
].map((dm) => ({
  label: dm,
  value: dm,
}));

export const RegionOptions = [Region.RuMoscow, Region.EuCzech].map((dm) => ({
  label: dm,
  value: dm,
}));

const DotaGameModeOptions = [
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
  label: `game_mode.${gm}` as TranslationKey,
  value: gm,
}));

export const useDotaGameModeOptions = () => {
  const { t } = useTranslation();
  return DotaGameModeOptions.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));
};

const GameModeOptions: { value: string; label: TranslationKey }[] = [
  { value: "undefined", label: "matchmaking_mode.all" },
  ...[
    // MatchmakingMode.RANKED,
    MatchmakingMode.UNRANKED,
    MatchmakingMode.SOLOMID,
    MatchmakingMode.BOTS2X2,
    MatchmakingMode.BOTS,
    MatchmakingMode.TURBO,
    MatchmakingMode.HIGHROOM,
  ].map((it) => ({
    value: it.toString(),
    label: `matchmaking_mode.${it}` as TranslationKey,
  })),
];

export const useGameModeOptions = () => {
  const { t } = useTranslation();
  return GameModeOptions.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));
};

export const HeroOptions = [
  { value: "undefined", label: "Все герои" },
  ...heroes
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((it) => ({
      value: it.tag,
      label: it.name,
    })),
];
