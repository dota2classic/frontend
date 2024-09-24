import React, { useEffect, useState } from "react";

import { ItemIconRaw } from "..";

import c from "./ItemTooltip.module.scss";

import { FaCoins } from "react-icons/fa";
import cx from "classnames";
import { ItemKey } from "@/const/itemdata";

interface IItemTooltipProps {
  item: ItemKey | string;
  hoveredElement: HTMLElement;
}

export interface ItemDataEntry {
  idx: number;
  item_name: string;
  description: string;
  name: string;
  cooldown: number;
  specials: string[];
  cost: number;
  recipe: boolean;
  notes: string[];
}

export const ItemTooltip: React.FC<IItemTooltipProps> = ({
  item,
  hoveredElement,
}) => {
  const [itemData, setItemData] = useState<ItemDataEntry[]>([]);

  useEffect(() => {
    if (itemData.length > 0) return;
    import("@/const/itemdata").then((it) => {
      setItemData(it.ItemData as any);
    });
  }, []);

  const d = itemData.find((t) => t.item_name === item);

  if (!d) return null;

  const rect = hoveredElement.getBoundingClientRect();
  return (
    <div className={c.tooltip} style={{ left: rect.left - 420, top: rect.top }}>
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
