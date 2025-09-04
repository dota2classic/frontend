import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import React from "react";
import { LocalStorageSavingPlugin } from "./plugins/LocalStorageSavingPlugin/LocalStorageSavingPlugin";
import HeroMentionPlugin from "./plugins/HeroMentionPlugin/HeroMentionPlugin";
import ItemMentionPlugin from "./plugins/ItemMentionPlugin/ItemMentionPlugin";
import PlayerMentionPlugin from "./plugins/PlayerMentionPlugin/PlayerMentionPlugin";

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
            // aria-placeholder={t('editor.placeholder')}
            placeholder={
              // <div className="editor-placeholder">{t('editor.placeholder')}</div>
              null
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
