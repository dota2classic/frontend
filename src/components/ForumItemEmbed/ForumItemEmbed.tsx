import React from "react";

import { ItemIconRaw } from "..";

import c from "./ForumItemEmbed.module.scss";
import { itemName } from "@/util/heroName";

interface IForumItemEmbedProps {
  itemId: number;
}

export const ForumItemEmbed: React.FC<IForumItemEmbedProps> = ({ itemId }) => {
  return (
    <div className={c.heroEmbed}>
      <ItemIconRaw small item={itemId} />
      <span>{itemName(itemId)}</span>
    </div>
  );
};
