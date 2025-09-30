/* eslint-disable */
export enum AchievementKey {
  HARDCORE = 0,
  GPM_1000 = 1,
  XPM_1000 = 2,
  GPM_XPM_1000 = 3,
  LAST_HITS_1000 = 4,
  DENIES_50 = 5,
  WINSTREAK_10 = 6,
  WIN_1HR_GAME = 7,
  WIN_1HR_GAME_AGAINST_TECHIES = 8,
  ALL_HERO_CHALLENGE = 9,
  WIN_BOT_GAME = 10,
  WIN_SOLOMID_GAME = 11,
  KILLS = 12,
  ASSISTS = 13,
  MEAT_GRINDER = 14,
  MAX_KILLS = 15,
  MAX_ASSISTS = 16,
  GLASSCANNON = 17,
  DENY_SUM = 18,
  LAST_HITS_SUM = 19,
  WIN_UNRANKED_GAME = 20,
  TOWER_DAMAGE = 21,
  TOWER_DAMAGE_SUM = 22,
  HERO_HEALING = 23,
  HERO_HEALING_SUM = 24,
  ALL_MELEE = 25,

  HERO_DAMAGE = 26,
  HERO_DAMAGE_SUM = 27,
  MISSES = 28,
  DEATH_SUM = 29
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
