import GenericMentionPlugin from "@/containers/RichEditor/plugins/GenericMentionPlugin/GenericMentionPlugin";
import React, { useCallback } from "react";
import c from "../HeroMentionPlugin/HeroMentionPlugin.module.scss";
import { ItemIconRaw } from "@/components";
import { ItemData, ItemDataEntry } from "@/const/itemdata";
import { $createItemMentionNode } from "@/containers/RichEditor/plugins/ItemMentionPlugin/ItemMentionNode";

const ItemRender = ({ name, id }: ItemDataEntry) => {
  return (
    <div className={c.heroEmbed}>
      <ItemIconRaw small item={id} />
      <span>{name}</span>
    </div>
  );
};

export default function ItemMentionPlugin() {
  const searchItem = useCallback(async (s: string) => {
    return ItemData.filter(
      ({ item_name, name }) =>
        item_name.toLowerCase().includes(s) || name.toLowerCase().includes(s),
    );
  }, []);
  return (
    <GenericMentionPlugin<ItemDataEntry>
      trigger="#"
      suggestionLimit={20}
      searchProvider={searchItem}
      keyProvider={(t) => t.item_name}
      RenderListItem={({ option }) => <ItemRender {...option} />}
      $createNode={(t) => $createItemMentionNode(t.id)}
    />
  );
}
