export function steam32to64(steam32: string | number) {
  steam32 = typeof steam32 === "string" ? parseInt(steam32) : steam32;
  const res = BigInt("76561197960265728") + BigInt(steam32);
  return res.toString();
}

export function steamPage(steam32: string | number) {
  return `https://steamcommunity.com/profiles/${steam32to64(steam32)}`;
}
