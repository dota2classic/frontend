/* eslint-disable */
export enum Dota2Version {
  Dota_681 = "Dota_681",
  Dota_678 = "Dota_678",
  Dota_684 = "Dota_684",
}

export function Dota2VersionFromJSON(json: any): Dota2Version {
  return Dota2VersionFromJSONTyped(json, false);
}

export function Dota2VersionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Dota2Version {
  return json as Dota2Version;
}

export function Dota2VersionToJSON(value?: Dota2Version | null): any {
  return value as any;
}
