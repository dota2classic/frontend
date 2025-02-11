import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import React from "react";
import { LocalStorageSavingPlugin } from "@/containers/RichEditor/plugins/LocalStorageSavingPlugin/LocalStorageSavingPlugin";
import HeroMentionPlugin from "@/containers/RichEditor/plugins/HeroMentionPlugin/HeroMentionPlugin";
import ItemMentionPlugin from "@/containers/RichEditor/plugins/ItemMentionPlugin/ItemMentionPlugin";
import PlayerMentionPlugin from "@/containers/RichEditor/plugins/PlayerMentionPlugin/PlayerMentionPlugin";

const placeholder = "Enter some rich text...";

interface RichEditorEditModeProps {
  saveKey: string;
}
export const RichEditorEditMode = ({ saveKey }: RichEditorEditModeProps) => {
  return (
    <>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="editor-input"
            aria-placeholder={placeholder}
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <PlayerMentionPlugin />
      <HeroMentionPlugin />
      <ItemMentionPlugin />
      <LocalStorageSavingPlugin saveKey={saveKey} />
    </>
  );
};
