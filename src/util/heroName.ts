import heroes from "./texts/heroes";

export default (fullName?: string) => {
  return heroes.find((it) => it.tag === fullName)?.name || "";
};

// export const heroId = (fullName: string) => {
//   return heroes.find(it => it.tag === fullName).
// }

export const fullName = (hero: string) =>
  hero.includes("npc_dota_hero_") ? hero : `npc_dota_hero_${hero}`;
export const shortName = (hero: string) =>
  hero.includes("npc_dota_hero_") ? hero.replace("npc_dota_hero_", "") : hero;
