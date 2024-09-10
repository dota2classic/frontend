export function numberOrDefault(value: any | undefined, defaultValue: any) {
  const v = Number(value);
  return Number.isNaN(v) ? defaultValue : v;
}
