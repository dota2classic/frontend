import React, { CSSProperties, useEffect, useState } from "react";

import { ItemIconRaw } from "..";

import c from "./ItemTooltip.module.scss";

import { FaCoins } from "react-icons/fa";
import cx from "clsx";
import type { ItemDataEntry } from "@/const/itemdata";
import { ItemKey } from "@/const/itemdata";
import { ItemMap } from "@/const/items";

interface IItemTooltipProps {
  item: ItemKey | string;
  hoveredElement: HTMLElement;
}

export const ItemTooltipRaw = ({
  item,
  style,
}: {
  style?: CSSProperties;
  item: string | number;
}) => {
  const [itemData, setItemData] = useState<ItemDataEntry[]>([]);

  useEffect(() => {
    if (itemData.length > 0) return;
    import("@/const/itemdata").then((it) => {
      setItemData(it.ItemData as ItemDataEntry[]);
    });
  }, [itemData.length]);

  const d = itemData.find((t) => {
    return typeof item === "string"
      ? t.item_name === item
      : t.item_name === "item_" + ItemMap.find((t) => t.id === item)!.name;
  });

  if (!d) return null;

  return (
    <div className={c.tooltip} style={style}>
      <div className={c.name}>
        <ItemIconRaw item={item} />
        <div>
          <span>{d.name}</span>
          <span>
            <FaCoins color={"#C9AF1D"} /> {d.cost}{" "}
          </span>
        </div>
      </div>
      <ul className={cx(c.stats)}>
        {d.specials.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <div
        className={cx(c.description, {
          [c.description__hidden]: d.description.trim().length === 0,
        })}
      >
        {d.description}
      </div>

      <div
        className={cx(c.description, {
          [c.description__hidden]: d.notes.length === 0,
        })}
      >
        {d.notes.join("\n")}
      </div>
    </div>
  );
};

export const ItemTooltip: React.FC<IItemTooltipProps> = ({
  item,
  hoveredElement,
}) => {
  const rect = hoveredElement.getBoundingClientRect();
  return (
    <ItemTooltipRaw
      item={item}
      style={{ left: rect.left - 420, top: rect.top }}
    />
  );
};
