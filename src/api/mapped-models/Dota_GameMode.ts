/* eslint-disable */
export enum DotaGameMode {
  ALLPICK = 1,
  CAPTAINS_MODE = 2,
  RANDOM_DRAFT = 3,
  SINGLE_DRAFT = 4,
  ALL_RANDOM = 5,
  // ? intro
  INTRO = 6,

  DIRETIDE = 7,
  REVERSE_CAPTAINS_MODE = 8,
  GREEVILING = 9,
  TUTORIAL = 10,
  MID_ONLY = 11,
  LEAST_PLAYED = 12,
  LIMITED_HEROES = 13,
  BALANCED_DRAFT = 17,
  ABILITY_DRAFT = 18,

  ARDM = 20,
  SOLOMID = 21,
  RANKED_AP = 22,
}

export function DotaGameModeFromJSON(json: any): DotaGameMode {
  return DotaGameModeFromJSONTyped(json, false);
}

export function DotaGameModeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DotaGameMode {
  return json as DotaGameMode;
}

export function DotaGameModeToJSON(value?: DotaGameMode | null): any {
  return value as any;
}
