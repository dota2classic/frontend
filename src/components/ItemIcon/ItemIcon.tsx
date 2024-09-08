import React from "react";

import c from "./ItemIcon.module.scss";
import cx from "classnames";

interface IItemIconProps {
  item: string;
  small?: boolean;
}

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  const fItem = item.replace("item_", "");

  const url = item.includes("emptyitem")
    ? `/items/${fItem}.webp`
    : `https://steamcdn-a.akamaihd.net/apps/dota2/images/items/${fItem}_lg.png`;
  return (
    <img
      width={60}
      height={44}
      alt={item}
      className={cx(c.item, { [c.small]: small })}
      src={url}
    />
  );
};
