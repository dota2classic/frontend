/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $insertNodes,
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaGrinTongueSquint,
  FaHeading,
  FaItalic,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";
import c from "./ToolbarPlugin.module.scss";
import cx from "clsx";
import { createPortal } from "react-dom";
import { EmoticonSelectWindow } from "@/components";
import { EmoticonDto } from "@/api/back";
import { $createEmojiNode } from "@/containers/RichEditor/plugins/EmojiPlugin/EmojiNode";
import findEmoji from "@/containers/RichEditor/plugins/EmojiPlugin/findEmoji";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

function $textNodeTransform(node: TextNode): void {
  if (!node.isSimpleText() || node.hasFormat("code")) {
    return;
  }

  const text = node.getTextContent();

  // Find only 1st occurrence as transform will be re-run anyway for the rest
  // because newly inserted nodes are considered to be dirty
  const emojiMatch = findEmoji(text);
  if (emojiMatch === null) {
    return;
  }

  let targetNode;
  if (emojiMatch.position === 0) {
    // First text chunk within string, splitting into 2 parts
    [targetNode] = node.splitText(
      emojiMatch.position + emojiMatch.code.length + 2, // 2 = : + :
    );
  } else {
    // In the middle of a string
    [, targetNode] = node.splitText(
      emojiMatch.position,
      emojiMatch.position + emojiMatch.code.length + 2, // 2 = : + :
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
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const emojiRef = useRef<HTMLButtonElement | null>(null);

  const [visible, setVisible] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
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
        (_payload, _newEditor) => {
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
    <div className={c.toolbar} ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label="Undo"
      >
        <FaUndo />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={c.toolbarItem}
        aria-label="Redo"
      >
        <FaRedo />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={cx(c.toolbarItem, c.spaced, isBold && c.active)}
        aria-label="Format Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={cx(c.toolbarItem, c.spaced, isItalic && c.active)}
        aria-label="Format Italics"
      >
        <FaItalic />
      </button>
      <button
        onClick={makeHeading}
        className={cx(c.toolbarItem, c.spaced, c.active)}
        aria-label="Format Heading"
      >
        <FaHeading />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={cx(c.toolbarItem, c.spaced, isUnderline && c.active)}
        aria-label="Format Underline"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={cx(c.toolbarItem, c.spaced, isStrikethrough && c.active)}
        aria-label="Format Strikethrough"
      >
        <FaStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label="Left Align"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label="Center Align"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className={cx(c.toolbarItem, c.spaced)}
        aria-label="Right Align"
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className={c.toolbarItem}
        aria-label="Justify Align"
      >
        <FaAlignJustify />
      </button>{" "}
      <Divider />
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
        aria-label="Undo"
        ref={emojiRef}
      >
        <FaGrinTongueSquint />
      </button>
    </div>
  );
}
