/* eslint-disable */
export enum Role {
  PLAYER = "PLAYER",
  OLD = "OLD",
  HUMAN = "HUMAN",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export function RoleFromJSON(json: any): Role {
  return RoleFromJSONTyped(json, false);
}

export function RoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Role {
  return json as Role;
}

export function RoleToJSON(value?: Role | null): any {
  return value as any;
}
