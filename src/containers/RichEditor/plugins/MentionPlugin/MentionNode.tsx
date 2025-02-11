/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $applyNodeReplacement,
  DecoratorNode,
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

export class MentionNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__steamId, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode(serializedNode.steamId).updateFromJSON(
      serializedNode,
    );
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

export function $createMentionNode(mentionSteamId: string): MentionNode {
  const mentionNode = new MentionNode(mentionSteamId);
  return $applyNodeReplacement(mentionNode);
}
