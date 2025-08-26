import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from "lexical";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaHeading,
  FaItalic,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";
import c from "./ToolbarPlugin.module.scss";
import cx from "clsx";
import { $createEmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import findEmoji from "@/containers/RichEditor/plugins/EmojiPlugin/findEmoji";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { InsertLinkButton } from "@/containers/RichEditor/plugins/InsertLinkPlugin";
import { useTranslation } from "react-i18next";

function $textNodeTransform(node: TextNode): void {
  if (!node.isSimpleText() || node.hasFormat("code")) {
    return;
  }

  const text = node.getTextContent();

  const emojiMatch = findEmoji(text);
  if (emojiMatch === null) {
    return;
  }

  let targetNode;
  if (emojiMatch.position === 0) {
    [targetNode] = node.splitText(
      emojiMatch.position + emojiMatch.code.length + 2,
    );
  } else {
    [, targetNode] = node.splitText(
      emojiMatch.position,
      emojiMatch.position + emojiMatch.code.length + 2,
    );
  }

  const emojiNode = $createEmojiNode(emojiMatch.code, emojiMatch.src);
  targetNode.replace(emojiNode);
}

const LowPriority = 1;

function Divider() {
  return <div className={c.divider} />;
}
export default function ToolbarPlugin() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(TextNode, $textNodeTransform),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  const makeHeading = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h2"));
      }
    });
  }, [editor]);

  return (
    <>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label={t("toolbar.undo")}
      >
        <FaUndo />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={c.toolbarItem}
        aria-label={t("toolbar.redo")}
      >
        <FaRedo />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={cx(c.toolbarItem, c.spaced, isBold && c.active)}
        aria-label={t("toolbar.formatBold")}
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={cx(c.toolbarItem, c.spaced, isItalic && c.active)}
        aria-label={t("toolbar.formatItalics")}
      >
        <FaItalic />
      </button>
      <button
        onClick={makeHeading}
        className={cx(c.toolbarItem, c.spaced, c.active)}
        aria-label={t("toolbar.formatHeading")}
      >
        <FaHeading />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={cx(c.toolbarItem, c.spaced, isUnderline && c.active)}
        aria-label={t("toolbar.formatUnderline")}
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={cx(c.toolbarItem, c.spaced, isStrikethrough && c.active)}
        aria-label={t("toolbar.formatStrikethrough")}
      >
        <FaStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label={t("toolbar.leftAlign")}
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label={t("toolbar.centerAlign")}
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label={t("toolbar.rightAlign")}
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className={c.toolbarItem}
        aria-label={t("toolbar.justifyAlign")}
      >
        <FaAlignJustify />
      </button>
      <InsertLinkButton />
    </>
  );
}
