/* eslint-disable */
export enum DotaMap {
  DOTA681 = "dota_training",
  DOTA = "dota",
  DOTA_WINTER = "dota_winter",
  DOTA_AUTUMN = "dota_autumn",
  DIRETIDE = "dota_diretide_12",
}

export function DotaMapFromJSON(json: any): DotaMap {
  return DotaMapFromJSONTyped(json, false);
}

export function DotaMapFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): DotaMap {
  return json as DotaMap;
}

export function DotaMapToJSON(value?: DotaMap | null): any {
  return value as any;
}
