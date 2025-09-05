import { $createLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
} from "lexical";

import { useCallback } from "react";
import c from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin.module.scss";
import { FaLink } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export function InsertLinkButton() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();

  const insertLink = useCallback(() => {
    const url = prompt(t("insert_link_plugin.enterUrl"));
    if (!url) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const linkNode = $createLinkNode(url, { target: "_blank" });
        linkNode.append($createTextNode(selection.getTextContent()));
        $insertNodes([linkNode, $createTextNode("")]); // insert linkNode by this
      }
    });
  }, [editor]);

  return (
    <button className={c.toolbarItem} onClick={insertLink}>
      <FaLink />
    </button>
  );
}
