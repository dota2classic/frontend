/* eslint-disable */
export enum DotaGameRulesState {
  INIT = 0,
  WAIT_FOR_PLAYERS_TO_LOAD = 1,
  HERO_SELECTION = 2,
  STRATEGY_TIME = 3,
  PRE_GAME = 4,
  GAME_IN_PROGRESS = 5,
  POST_GAME = 6,
  DISCONNECT = 7,
  TEAM_SHOWCASE = 8,
  CUSTOM_GAME_SETUP = 9,
  WAIT_FOR_MAP_TO_LOAD = 10,
  SCENARIO_SETUP = 11,
  LAST = 12
}

export function DotaGameRulesStateFromJSON(json: any): DotaGameRulesState {
  return DotaGameRulesStateFromJSONTyped(json, false);
}

export function DotaGameRulesStateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DotaGameRulesState {
  return json as DotaGameRulesState;
}

export function DotaGameRulesStateToJSON(value?: DotaGameRulesState | null): any {
  return value as any;
}
