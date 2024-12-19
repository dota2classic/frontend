/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import { $createMentionNode } from "@/components/MentionPlugin/mention-node";
import { UserDTO } from "@/api/back";
import { SearchMockData } from "@/components/MentionPlugin/mock-data";
import { PageLink, PlayerAvatar } from "@/components";
import c from "./MentionPlugin.module.scss";
import cx from "clsx";
import { AppRouter } from "@/route";
import { computePosition } from "@floating-ui/dom";
import { usePointerInteractions } from "@/components/MentionPlugin/usePointerInteractions";
import { FloatingMenuCoords } from "@/components/MentionPlugin/FloatingMenu";

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  "(?:" +
  "\\.[ |$]|" + // E.g. "r. " in "Mr. Smith"
  " |" + // E.g. " " in "Josh Duck"
  "[" +
  PUNC +
  "]|" + // E.g. "-' in "Salier-Hellendag"
  ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$",
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    "){0," +
    ALIAS_LENGTH_LIMIT +
    "})" +
    ")$",
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 3;

const mentionsCache = new Map();

const dummyLookupService = {
  search(string: string, callback: (results: UserDTO[]) => void): void {
    setTimeout(() => {
      const results = SearchMockData.filter((mention) =>
        mention.name.toLowerCase().includes(string.toLowerCase()),
      );
      callback(results);
    }, 100);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<UserDTO[]>([]);

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
  constructor(public readonly user: UserDTO) {
    super(user.steamId);
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={c.preview}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <PlayerAvatar
        width={20}
        height={20}
        src={option.user.avatar}
        alt={`Avatar of player ${name}`}
      />
      <PageLink
        className={cx("link")}
        link={AppRouter.players.player.index(option.user.steamId).link}
        testId={"player-summary-player-name"}
      >
        {option.user.steamId.length > 2
          ? option.user.name
          : `Бот #${option.user.steamId}`}
      </PageLink>
    </li>
  );
}

export default function MentionPlugin() {
  const [editor] = useLexicalComposerContext();

  const ref = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);

  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(queryString);

  const { isPointerDown, isPointerReleased } = usePointerInteractions();

  const calculatePosition = useCallback(() => {
    const domSelection = getSelection();
    const domRange =
      domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);

    if (!domRange || !ref.current || isPointerDown) return setCoords(undefined);

    computePosition(domRange, ref.current, { placement: "top" })
      .then((pos) => {
        setCoords({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setCoords(undefined);
      });
  }, [isPointerDown]);

  const $handleSelectionChange = useCallback(() => {
    if (
      editor.isComposing() ||
      editor.getRootElement() !== document.activeElement
    ) {
      setCoords(undefined);
      return;
    }

    calculatePosition();
  }, [editor, calculatePosition]);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => $handleSelectionChange());
      },
    );
    return unregisterListener;
  }, [editor, $handleSelectionChange]);

  const show = coords !== undefined;

  useEffect(() => {
    if (!show && isPointerReleased) {
      editor.getEditorState().read(() => $handleSelectionChange());
    }
    // Adding show to the dependency array causes an issue if
    // a range selection is dismissed by navigating via arrow keys.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPointerReleased, $handleSelectionChange, editor]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map((result) => new MentionTypeaheadOption(result))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.user);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      anchorClassName={c.something}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        return anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div
                ref={ref}
                className="typeahead-popover mentions-menu"
                style={{
                  position: "absolute",
                  top: coords?.y,
                  left: coords?.x,
                  visibility: !!coords ? "visible" : "hidden",
                  opacity: !!coords ? 1 : 0,
                }}
              >
                <ul className={c.previewListItem}>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              document.body,
            )
          : null;
      }}
    />
  );
}
