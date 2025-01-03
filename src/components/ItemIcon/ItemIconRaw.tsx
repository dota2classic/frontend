import React, { useContext, useRef } from "react";
import { TooltipContext } from "@/util/hooks";
import { ItemMap } from "@/const/items";
import cx from "clsx";
import c from "@/components/ItemIcon/ItemIcon.module.scss";
import {
  bigImageStyles,
  IItemIconProps,
  smallImageStyles,
} from "@/components/ItemIcon/ItemIcon.props";
import { PlaceholderImage } from "@/components";

export const ItemIconRaw: React.FC<IItemIconProps> = ({ item, small }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const ctx = useContext(TooltipContext);

  const fItem =
    typeof item === "number"
      ? ItemMap.find((it) => it.id === item)!.name
      : item.replace("item_", "");

  if (fItem.includes("empty"))
    return (
      <PlaceholderImage
        width={small ? smallImageStyles.width : bigImageStyles.width}
        height={small ? smallImageStyles.height : bigImageStyles.height}
      />
    );

  const url = fItem.includes("empty")
    ? `/items/emptyitembg.webp`
    : fItem.includes("recipe")
      ? "/items/recipe.jpg"
      : `https://steamcdn-a.akamaihd.net/apps/dota2/images/items/${fItem}_lg.png`;
  return (
    <img
      data-item-id={item}
      ref={ref}
      onMouseEnter={(e) =>
        ctx.setCtx({ item: "item_" + fItem, hovered: e.currentTarget! })
      }
      onMouseLeave={() => ctx.setCtx(undefined)}
      width={small ? smallImageStyles.width : bigImageStyles.width}
      height={small ? smallImageStyles.height : bigImageStyles.height}
      alt={`Item ${fItem}`}
      className={cx(c.item, { [c.small]: small })}
      src={url}
    />
  );
};
