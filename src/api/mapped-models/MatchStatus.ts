/* eslint-disable */
export enum MatchStatus {
  /** The two matches leading to this one are not completed yet. */
  Locked = 0,
  /** One participant is ready and waiting for the other one. */
  Waiting = 1,
  /** Both participants are ready to start. */
  Ready = 2,
  /** The match is running. */
  Running = 3,
  /** The match is completed. */
  Completed = 4,
  /** At least one participant completed his following match. */
  Archived = 5
}


export function MatchStatusFromJSON(json: any): MatchStatus {
  return MatchStatusFromJSONTyped(json, false);
}

export function MatchStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): MatchStatus {
  return json as MatchStatus;
}

export function MatchStatusToJSON(value?: MatchStatus | null): any {
  return value as any;
}
