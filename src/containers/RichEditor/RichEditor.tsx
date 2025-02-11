import React from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { Rubik } from "next/font/google";
import ToolbarPlugin from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin";
import {
  DOMExportOutput,
  EditorState,
  isHTMLElement,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";
import ExampleTheme from "@/containers/RichEditor/ExampleTheme";
import { EmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import { HeadingNode } from "@lexical/rich-text";
import { MentionNode } from "@/containers/RichEditor/plugins/MentionPlugin/MentionNode";
import { RichEditorEditMode } from "@/containers/RichEditor/RichEditorEditMode";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface IRichEditorProps {
  onChange: (r: EditorState) => void;
  saveKey: string;
}

export const RichEditor: React.FC<IRichEditorProps> = ({
  onChange,
  saveKey,
}) => {
  const editorConfig: InitialConfigType = {
    namespace: "React.js Demo",
    onError(error: Error) {
      throw error;
    },
    nodes: [ParagraphNode, TextNode, EmojiNode, HeadingNode, MentionNode],
    theme: ExampleTheme,
  };

  return (
    <div className={threadFont.className}>
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichEditorEditMode saveKey={saveKey} />
          <OnChangePlugin onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};
