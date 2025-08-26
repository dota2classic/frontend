import { createPortal } from "react-dom";
import { EmoticonSelectWindow } from "@/components";
import cx from "clsx";
import c from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin.module.scss";
import { FaGrinTongueSquint } from "react-icons/fa";
import React, { useCallback, useRef, useState } from "react";
import { EmoticonDto } from "@/api/back";
import { $createEmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import { $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useTranslation } from "react-i18next";

export default function EmojiPlugin() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const emojiRef = useRef<HTMLButtonElement | null>(null);

  const [visible, setVisible] = useState(false);

  const insertEmoji = useCallback(
    (emo: EmoticonDto) => {
      editor.update(() => {
        // Create a new ParagraphNode
        const emojiNode = $createEmojiNode(emo.code, emo.src);

        $insertNodes([emojiNode]);
        // Finally, append the paragraph to the root
      });
    },
    [editor],
  );

  return (
    <>
      {visible &&
        createPortal(
          <EmoticonSelectWindow
            onSelect={insertEmoji}
            anchor={emojiRef}
            onClose={() => setVisible(false)}
          />,
          document.body,
        )}
      <button
        onClick={() => setVisible((vis) => !vis)}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label={t("emoji_plugin.undo")}
        ref={emojiRef}
      >
        <FaGrinTongueSquint />
      </button>
    </>
  );
}
