import React from "react";

import c from "./ItemIcon.module.scss";
import cx from "classnames";
import { ItemMap } from "@/const/items";

interface IItemIconProps {
  item: string | number;
  small?: boolean;
}

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  const fItem =
    typeof item === "number"
      ? ItemMap.find((it) => it.id === item)!.name
      : item.replace("item_", "");

  const url = fItem.includes("empty")
    ? `/items/emptyitembg.webp`
    : `https://steamcdn-a.akamaihd.net/apps/dota2/images/items/${fItem}_lg.png`;
  return (
    <img
      width={60}
      height={44}
      alt={`Item ${fItem}`}
      className={cx(c.item, { [c.small]: small })}
      src={url}
    />
  );
};
