export function formatWinrate(wins: number, loss: number) {
  const total = wins + loss;

  return ((100 * wins) / Math.max(1, total)).toFixed(2) + "%";
}

export function winrate(wins: number, loss: number) {
  const total = wins + loss;

  return wins / Math.max(1, total);
}



export function remapNumber(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number,
) {
  return low2 + ((value - low1) * (high2 - low2)) / (high1 - low1);
}
