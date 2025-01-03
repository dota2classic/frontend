export function maxBy<T>(arr: T[], val: (t: T) => number): T {
  return arr.toSorted((a, b) => val(b) - val(a))[0];
}
