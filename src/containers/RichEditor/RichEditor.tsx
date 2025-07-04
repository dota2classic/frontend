import React, { useState } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { Rubik } from "next/font/google";
import ToolbarPlugin from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin";
import { ParagraphNode, SerializedEditorState, TextNode } from "lexical";
import ExampleTheme from "@/containers/RichEditor/ExampleTheme";
import { EmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import { HeadingNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { RichEditorEditMode } from "@/containers/RichEditor/RichEditorEditMode";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ItemMentionNode } from "@/containers/RichEditor/plugins/ItemMentionPlugin/ItemMentionNode";
import { PlayerMentionNode } from "@/containers/RichEditor/plugins/PlayerMentionPlugin/PlayerMentionNode";
import { HeroMentionNode } from "@/containers/RichEditor/plugins/HeroMentionPlugin/HeroMentionNode";
import c from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin.module.scss";
import EmojiPlugin from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiPlugin";
import ImageUploadPlugin from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageUploadPlugin";
import { ImageNode } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageNode";
import { $generateHtmlFromNodes } from "@lexical/html";
import { BlogpostRenderer } from "@/components";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IRichEditorProps {
  onChange: (r: SerializedEditorState, html: string) => void;
  saveKey: string;
}

export const RichEditor: React.FC<IRichEditorProps> = ({
  onChange,
  saveKey,
}) => {
  const [previewHtml, setPreviewHtml] = useState("");
  const editorConfig: InitialConfigType = {
    namespace: "React.js Demo",
    onError(error: Error) {
      throw error;
    },
    nodes: [
      ParagraphNode,
      TextNode,
      EmojiNode,
      HeadingNode,
      PlayerMentionNode,
      HeroMentionNode,
      ItemMentionNode,
      ImageNode,
      LinkNode,
    ],
    theme: ExampleTheme,
  };

  return (
    <div className={threadFont.className}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className={c.toolbar}>
          <ToolbarPlugin />
          <EmojiPlugin />
          <ImageUploadPlugin />
          <LinkPlugin />
        </div>
        <div className="editor-inner">
          <RichEditorEditMode saveKey={saveKey} />
          <OnChangePlugin
            onChange={(es, le) => {
              le.read(() => {
                const html = $generateHtmlFromNodes(le, null);
                onChange(es.toJSON(), html);
                setPreviewHtml(html);
              });
            }}
          />
        </div>
      </LexicalComposer>

      <BlogpostRenderer html={previewHtml} />
    </div>
  );
};
