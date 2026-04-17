/* eslint-disable */

export enum DotaPatch {
  DOTA_684 = "DOTA_684",
  DOTA_684_TURBO = "DOTA_684_TURBO",
  DOTA_688 = "DOTA_688",
}

export function DotaPatchFromJSON(json: any): DotaPatch {
  return DotaPatchFromJSONTyped(json, false);
}

export function DotaPatchFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DotaPatch {
  return json as DotaPatch;
}

export function DotaPatchToJSON(value?: DotaPatch | null): any {
  return value as any;
}
