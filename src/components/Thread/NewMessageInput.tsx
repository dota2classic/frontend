import { ThreadMessageDTO } from "@/api/back";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot, $getSelection } from "lexical";
import c from "./MessageInput.module.scss";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import MentionPlugin from "@/components/MentionPlugin/MentionPlugin";
import { MentionNode } from "@/components/MentionPlugin/mention-node";

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

interface Props {
  threadId: string;
  canMessage: boolean;
  onMessage: (mgs: ThreadMessageDTO) => void;
  rows: number;
  className?: string;
}

function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

function onError(error) {
  console.error(error);
}

export const NewMessageInput = (p: Props) => {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    onError,
    nodes: [MentionNode],
  };

  return (
    <div className={c.textInputContainer}>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className={c.textInput} />}
          placeholder={<div className={c.placeholder}>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MentionPlugin />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
};
