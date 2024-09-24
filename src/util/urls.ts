import Qs from "qs";

export function numberOrDefault(value: any | undefined, defaultValue: any) {
  const v = Number(value);
  return Number.isNaN(v) ? defaultValue : v;
}

export function queryParameters(params: Record<string, any>) {
  const q = Qs.stringify(params);

  // console.log(q)
  return q.length > 1 ? "?" + q : "";
}

export function watchUrl(serverUrl: string): string {
  const host = serverUrl.split(":")[0];
  const port = parseInt(serverUrl.split(":")[1]);
  return `steam://connect/${host}:${port + 5}`;
}
