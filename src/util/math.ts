export function formatWinrate(wins: number, loss: number) {
  const total = wins + loss;

  return ((100 * wins) / Math.max(1, total)).toFixed(2) + "%";
}

export function winrate(wins: number, loss: number) {
  const total = wins + loss;

  return wins / Math.max(1, total);
}


/**
 *
 *
 *
 * 32 127653937
 *
 * 64 76561198087919665
 *
 */


export function steam32to64(steam32: string | number){
  steam32 = typeof steam32 === 'string' ? parseInt(steam32) : steam32;
  const res = BigInt("76561197960265728") + BigInt(steam32);
  return res.toString()
}
