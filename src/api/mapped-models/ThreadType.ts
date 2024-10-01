export enum ThreadType {
  MATCH = "match",
  PROFILE = "profile",
  FORUM = "forum",
}

export function ThreadTypeFromJSON(json: any): ThreadType {
  return ThreadTypeFromJSONTyped(json, false);
}

export function ThreadTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ThreadType {
  return json as ThreadType;
}

export function ThreadTypeToJSON(value?: ThreadType | null): any {
  return value as any;
}
