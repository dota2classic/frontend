import { ItemMap } from "@/const/items";

export interface IItemIconProps {
  item: string | number;
  small?: boolean;
  noTooltip?: boolean;
}

export function asItemId(item: string | number) {
  return typeof item === "number"
    ? item
    : ItemMap.find((it) => it.name === item)!.id;
}
export const smallImageStyles = { width: 40, height: 30 };
export const bigImageStyles = { width: 53.13, height: 40 };
