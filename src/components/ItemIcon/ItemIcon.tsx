import React, { useContext, useRef } from "react";

import c from "./ItemIcon.module.scss";
import cx from "classnames";
import { ItemMap } from "@/const/items";
import { TooltipContext } from "@/util/hooks";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";

interface IItemIconProps {
  item: string | number;
  small?: boolean;
}

function asItemId(item: string | number) {
  return typeof item === "number"
    ? item
    : ItemMap.find((it) => it.name === item)!.id;
}

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  return (
    <PageLink link={AppRouter.items.item(asItemId(item)).link}>
      <ItemIconRaw item={item} small={small} />
    </PageLink>
  );
};

const smallImageStyles = { width: 40, height: 30 };
const bigImageStyles = { width: 53, height: 40 };

export const ItemIconRaw: React.FC<IItemIconProps> = ({ item, small }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const ctx = useContext(TooltipContext);

  const fItem =
    typeof item === "number"
      ? ItemMap.find((it) => it.id === item)!.name
      : item.replace("item_", "");

  if (fItem.includes("empty"))
    return (
      <span
        style={small ? smallImageStyles : bigImageStyles}
        className={c.img2}
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
      height={small ? smallImageStyles.width : bigImageStyles.width}
      alt={`Item ${fItem}`}
      className={cx(c.item, { [c.small]: small })}
      src={url}
    />
  );
};
