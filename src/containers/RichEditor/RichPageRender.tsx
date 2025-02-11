import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ParagraphNode, TextNode } from "lexical";
import { EmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import { HeadingNode } from "@lexical/rich-text";
import ExampleTheme from "@/containers/RichEditor/ExampleTheme";
import { Rubik } from "next/font/google";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import React from "react";
import { ItemMentionNode } from "@/containers/RichEditor/plugins/ItemMentionPlugin/ItemMentionNode";
import { HeroMentionNode } from "@/containers/RichEditor/plugins/HeroMentionPlugin/HeroMentionNode";
import { PlayerMentionNode } from "@/containers/RichEditor/plugins/PlayerMentionPlugin/PlayerMentionNode";
import { ImageNode } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageNode";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface RichPageRenderProps {
  state: string;
}

export const RichPageRender = ({ state }: RichPageRenderProps) => {
  const editorConfig: InitialConfigType = {
    namespace: "amogus",
    onError(error: Error) {
      throw error;
    },
    editable: false,
    nodes: [
      ParagraphNode,
      TextNode,
      EmojiNode,
      HeadingNode,
      PlayerMentionNode,
      HeroMentionNode,
      ItemMentionNode,
      ImageNode,
    ],
    theme: ExampleTheme,
    editorState: state,
  };

  return (
    <div className={threadFont.className}>
      <LexicalComposer initialConfig={editorConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
};
