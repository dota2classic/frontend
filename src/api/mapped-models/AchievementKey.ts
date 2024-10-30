/* eslint-disable */
export enum AchievementKey {
  HARDCORE,
  GPM_1000,
  XPM_1000,
  GPM_XPM_1000,
  LAST_HITS_1000,
  DENIES_50,
  WINSTREAK_10,
  WIN_1HR_GAME,
  WIN_1HR_GAME_AGAINST_TECHIES,
  ALL_HERO_CHALLENGE,
}

export function AchievementKeyFromJSON(json: any): AchievementKey {
  return AchievementKeyFromJSONTyped(json, false);
}

export function AchievementKeyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): AchievementKey {
  return json as AchievementKey;
}

export function AchievementKeyToJSON(value?: AchievementKey | null): any {
  return value as any;
}
