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


export function parseJwt<T>(token: string): T {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c: string) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}
