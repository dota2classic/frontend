import { NodeKey, SerializedTextNode, Spread, TextNode } from "lexical";
import c from "./Emoji.module.scss";

export type SerializedEmojiNode = Spread<
  {
    code: string;
    src: string;
  },
  SerializedTextNode
>;

export class EmojiNode extends TextNode {
  private code: string;
  private src: string;

  static getType(): string {
    return "emoji";
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.code, node.src, node.__key);
  }

  constructor(code: string, src: string, key?: NodeKey) {
    super(code, key);

    this.code = code;
    this.src = src;
  }

  /**
   * DOM that will be rendered by browser within contenteditable
   * This is what Lexical renders
   */
  createDOM(): HTMLElement {
    // const dom = document.createElement("span");
    // dom.style.backgroundImage = `url('https://s3.dotaclassic.ru/emoticons/poop.gif')`;
    // dom.innerText = this.code;

    const dom = document.createElement("img");
    dom.src = this.src;
    dom.className = c.emoji;

    return dom;
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    return $createEmojiNode(
      serializedNode.code,
      serializedNode.src,
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      code: this.code,
      src: this.src,
    };
  }
}

export function $createEmojiNode(code: string, src: string): EmojiNode {
  // In token mode node can be navigated through character-by-character,
  // but are deleted as a single entity (not invdividually by character).
  // This also forces Lexical to create adjacent TextNode on user input instead of
  // modifying Emoji node as it now acts as immutable node.
  return new EmojiNode(code, src).setMode("token");
}
