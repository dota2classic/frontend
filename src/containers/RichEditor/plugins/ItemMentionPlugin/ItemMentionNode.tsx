import {
  $applyNodeReplacement,
  DecoratorNode,
  type NodeKey,
  SerializedLexicalNode,
  type Spread,
} from "lexical";
import React, { ReactNode } from "react";
import { ForumItemEmbed } from "@/components";

export type SerializedMentionNode = Spread<
  {
    itemId: number;
  },
  SerializedLexicalNode
>;

export class ItemMentionNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "item-mention";
  }

  static clone(node: ItemMentionNode): ItemMentionNode {
    return new ItemMentionNode(node.__itemId, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): ItemMentionNode {
    return $createItemMentionNode(serializedNode.itemId).updateFromJSON(
      serializedNode,
    );
  }

  constructor(
    private readonly __itemId: number,
    key?: NodeKey,
  ) {
    super(key);
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      itemId: this.__itemId,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return <ForumItemEmbed nolink itemId={this.__itemId} />;
  }
}

export function $createItemMentionNode(itemId: number): ItemMentionNode {
  const mentionNode = new ItemMentionNode(itemId);
  return $applyNodeReplacement(mentionNode);
}
