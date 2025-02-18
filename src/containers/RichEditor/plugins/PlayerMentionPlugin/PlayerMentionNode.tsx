import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  type NodeKey,
  SerializedLexicalNode,
  type Spread,
} from "lexical";
import React, { ReactNode } from "react";
import { ForumUserEmbed } from "@/components";

export type SerializedMentionNode = Spread<
  {
    steamId: string;
  },
  SerializedLexicalNode
>;

export class PlayerMentionNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "player-mention";
  }

  static clone(node: PlayerMentionNode): PlayerMentionNode {
    return new PlayerMentionNode(node.__steamId, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): PlayerMentionNode {
    return $createPlayerMentionNode(serializedNode.steamId).updateFromJSON(
      serializedNode,
    );
  }

  exportDOM(): DOMExportOutput {
    const a = document.createElement("a");
    a.dataset["steam_id"] = this.__steamId;

    return {
      element: a,
    };
  }

  constructor(
    private readonly __steamId: string,
    key?: NodeKey,
  ) {
    super(key);
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      steamId: this.__steamId,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return <ForumUserEmbed nolink steamId={this.__steamId} />;
  }
}

export function $createPlayerMentionNode(steamId: string): PlayerMentionNode {
  const mentionNode = new PlayerMentionNode(steamId);
  return $applyNodeReplacement(mentionNode);
}
