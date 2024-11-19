/* eslint-disable */
export enum BanReason {
  GAME_DECLINE,
  LOAD_FAILURE,
  INFINITE_BAN,
  REPORTS,
  ABANDON,
  LEARN2PLAY
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
