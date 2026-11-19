import Qs from "qs";

export function numberOrDefault<T = number>(
  value: string | number | string[] | undefined,
  defaultValue: T,
): T | number {
  const v = Number(value);
  return Number.isNaN(v) ? defaultValue : v;
}

export function parsePage(
  value: string | string[] | number | undefined,
  max = 10_000,
): number {
  const page = Math.trunc(Number(value));
  return Number.isFinite(page) ? Math.min(Math.max(page, 0), max) : 0;
}

export function queryParameters(
  params: Record<string, string | string[] | number | undefined>,
) {
  const q = Qs.stringify(params);

  return q.length > 1 ? "?" + q : "";
}

export function watchUrl(serverUrl: string): string {
  const host = serverUrl.split(":")[0];
  const port = parseInt(serverUrl.split(":")[1]);
  return `steam://connect/${host}:${port + 1}`;
}

export function watchCmd(serverUrl: string): string {
  const host = serverUrl.split(":")[0];
  const port = parseInt(serverUrl.split(":")[1]);
  return `connect ${host}:${port + 1}`;
}

export function spectateUrl(matchId: number): string {
  return `d2c://spectate/${matchId}`;
}
