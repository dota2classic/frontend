/* eslint-disable */
export enum BanReason {
  GAME_DECLINE = 0,
  LOAD_FAILURE = 1,
  INFINITE_BAN = 2,
  ABANDON = 4,
  RULE_VIOLATION = 7,
}


export function BanReasonFromJSON(json: any): BanReason {
  return BanReasonFromJSONTyped(json, false);
}

export function BanReasonFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): BanReason {
  return json as BanReason;
}

export function BanReasonToJSON(value?: BanReason | null): any {
  return value as any;
}
