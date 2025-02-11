import {
  $applyNodeReplacement,
  DecoratorNode,
  type NodeKey,
  SerializedLexicalNode,
  type Spread,
} from "lexical";
import React, { ReactNode } from "react";
import { ForumHeroEmbed } from "@/components";

export type SerializedMentionNode = Spread<
  {
    hero: string;
  },
  SerializedLexicalNode
>;

export class HeroMentionNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "hero-mention";
  }

  static clone(node: HeroMentionNode): HeroMentionNode {
    return new HeroMentionNode(node.__hero, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): HeroMentionNode {
    return $createHeroMentionNode(serializedNode.hero).updateFromJSON(
      serializedNode,
    );
  }

  constructor(
    private readonly __hero: string,
    key?: NodeKey,
  ) {
    super(key);
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      hero: this.__hero,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return <ForumHeroEmbed nolink hero={this.__hero} />;
  }
}

export function $createHeroMentionNode(hero: string): HeroMentionNode {
  const mentionNode = new HeroMentionNode(hero);
  return $applyNodeReplacement(mentionNode);
}
