/* eslint-disable */
export enum DotaConnectionState {
  DOTA_CONNECTION_STATE_UNKNOWN = 0,
  DOTA_CONNECTION_STATE_NOT_YET_CONNECTED = 1,
  DOTA_CONNECTION_STATE_CONNECTED = 2,
  DOTA_CONNECTION_STATE_DISCONNECTED = 3,
  DOTA_CONNECTION_STATE_ABANDONED = 4,
  DOTA_CONNECTION_STATE_LOADING = 5,
  DOTA_CONNECTION_STATE_FAILED = 6,
}

export function DotaConnectionStateFromJSON(json: any): DotaConnectionState {
  return DotaConnectionStateFromJSONTyped(json, false);
}

export function DotaConnectionStateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DotaConnectionState {
  return json as DotaConnectionState;
}

export function DotaConnectionStateToJSON(value?: DotaConnectionState | null): any {
  return value as any;
}