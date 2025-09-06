import { NodeKey, SerializedTextNode, Spread, TextNode } from "lexical";

export type SerializedImageNode = Spread<
  {
    src: string;
  },
  SerializedTextNode
>;

export class ImageNode extends TextNode {
  private __src: string;

  static getType(): string {
    return "image";
  }

  // isInline(): boolean {
  //   return false;
  // }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src: string, key?: NodeKey) {
    super("1", key);

    this.__src = src;
  }

  /**
   * DOM that will be rendered by browser within contenteditable
   * This is what Lexical renders
   */
  createDOM(): HTMLElement {
    const dom = document.createElement("img");
    dom.src = this.__src;
    dom.className = "embedImage";

    return dom;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode.src).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
    };
  }
}

export function $createImageNode(src: string): ImageNode {
  return new ImageNode(src);
}
