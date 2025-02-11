import { useLocalStorage } from "react-use";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useCallback, useEffect, useState } from "react";

interface LocalStorageSavingPluginProps {
  saveKey: string;
}

export function LocalStorageSavingPlugin({
  saveKey,
}: LocalStorageSavingPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [serializedEditorState, setSerializedEditorState] = useLocalStorage<
    string | null
  >(saveKey, null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);

      if (serializedEditorState) {
        editor.update(() => {
          const initialEditorState = editor.parseEditorState(
            serializedEditorState,
          );
          editor.setEditorState(initialEditorState);
        });
      }
    }
  }, [isFirstRender, serializedEditorState, editor]);

  const onChange = useCallback(
    (editorState: EditorState) => {
      setSerializedEditorState(JSON.stringify(editorState.toJSON()));
    },
    [setSerializedEditorState],
  );

  return <OnChangePlugin onChange={onChange} />;
}
