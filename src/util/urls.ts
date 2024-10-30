import Qs from "qs";

export function numberOrDefault<T = number>(value: string | number | string[] | undefined, defaultValue: T): T | number {
  const v = Number(value);
  return Number.isNaN(v) ? defaultValue : v;
}

export function queryParameters(params: Record<string, string | string[] | number>) {
  const q = Qs.stringify(params);

  // console.log(q)
  return q.length > 1 ? "?" + q : "";
}

export function watchUrl(serverUrl: string): string {
  const host = serverUrl.split(":")[0];
  const port = parseInt(serverUrl.split(":")[1]);
  return `steam://connect/${host}:${port + 5}`;
}
