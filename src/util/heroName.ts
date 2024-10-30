import heroes from "./texts/heroes";
import { ItemMap } from "@/const/items";
import { ItemData } from "@/const/itemdata";

const heroName = (fullName?: string) => {
  return heroes.find((it) => it.tag === fullName)?.name || "";
};
export default heroName;


export const fullName = (hero: string) =>
  hero.includes("npc_dota_hero_") ? hero : `npc_dota_hero_${hero}`;
export const shortName = (hero: string) =>
  hero.includes("npc_dota_hero_") ? hero.replace("npc_dota_hero_", "") : hero;

export const itemName = (item: number) => {
  const key = "item_" + ItemMap.find((z) => z.id === item)!.name;
  return ItemData.find((t) => t.item_name === key)!.name;
};
