import React from "react";

import { ItemIconRaw } from "..";

import c from "./ItemTooltip.module.scss";
import { ItemData, ItemKey } from "@/const/itemdata";
import { FaCoins } from "react-icons/fa";
import cx from "classnames";

interface IItemTooltipProps {
  item: ItemKey | string;
  hoveredElement: HTMLElement;
}

export const ItemTooltip: React.FC<IItemTooltipProps> = ({
  item,
  hoveredElement,
}) => {
  const d = ItemData.find((t) => t.item_name === item);

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
