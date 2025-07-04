/* tslint:disable */
/* eslint-disable */
export enum PlayerAspect {
  FRIENDLY = "FRIENDLY",
  TALKATIVE = "TALKATIVE",
  OPTIMIST = "OPTIMIST",
  TOXIC = "TOXIC",
  CLOWN = "CLOWN",
}

export function PlayerAspectFromJSON(json: any): PlayerAspect {
  return PlayerAspectFromJSONTyped(json, false);
}

export function PlayerAspectFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): PlayerAspect {
  return json as PlayerAspect;
}

export function PlayerAspectToJSON(value?: PlayerAspect | null): any {
  return value as any;
}
