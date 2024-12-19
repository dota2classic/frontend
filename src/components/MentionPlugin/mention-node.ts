/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from "lexical";
// import c from "./MentionPlugin.module.scss"
import c from "@/components/ForumUserEmbed/ForumUserEmbed.module.scss";
import { UserDTO } from "@/api/back";

export type SerializedMentionNode = Spread<
  {
    user: UserDTO;
  },
  SerializedTextNode
>;

// function $convertMentionElement(
//   domNode: HTMLElement,
// ): DOMConversionOutput | null {
//   const textContent = domNode.textContent;
//
//   if (textContent !== null) {
//     const node = $createMentionNode(textContent);
//     return {
//       node,
//     };
//   }
//
//   return null;
// }

export class MentionNode extends TextNode {
  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.user, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.user);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(
    public readonly user: UserDTO,
    text?: string,
    key?: NodeKey,
  ) {
    super(text ?? user.name, key);
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      user: this.user,
      type: "mention",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    // dom.style.cssText = mentionStyle;
    dom.className = c.userEmbed;
    dom.spellcheck = false;
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.textContent = `@${this.__text}`;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        return null;
        // if (!domNode.hasAttribute('data-lexical-mention')) {
        //   return null;
        // }
        // return {
        //   conversion: $convertMentionElement,
        //   priority: 1,
        // };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(user: UserDTO): MentionNode {
  const mentionNode = new MentionNode(user);
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
