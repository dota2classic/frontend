import React from "react";

import c from "./ItemIcon.module.scss";
import cx from "classnames";

interface IItemIconProps {
  item: string;
  small?: boolean;
}

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  let url: string;
  const fItem = item.replace("item_", "");
  url = `/items/${fItem}.webp`;
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
