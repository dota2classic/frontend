/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { BaseSelection, NodeKey, TextNode } from "lexical";
import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
} from "lexical";
import type { JSX } from "react";
import { useCallback, useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";

// import { useToolbarState } from "../../context/ToolbarContext";
import { getApi } from "@/api/hooks";
import {
  $createAutocompleteNode,
  AutocompleteNode,
  uuid,
} from "@/containers/RichEditor/plugins/AutcompletePlugin/AutocompleteNode";

const HISTORY_MERGE = { tag: "history-merge" };

declare global {
  interface Navigator {
    userAgentData?: {
      mobile: boolean;
    };
  }
}

type SearchPromise = {
  dismiss: () => void;
  promise: Promise<null | string>;
};

// TODO lookup should be custom
function $search(selection: null | BaseSelection): [boolean, string] {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return [false, ""];
  }
  const node = selection.getNodes()[0];
  const anchor = selection.anchor;
  // Check siblings?
  if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
    return [false, ""];
  }
  const word = [];
  const text = node.getTextContent();
  let i = node.getTextContentSize();
  let c;
  while (i-- && i >= 0 && (c = text[i]) !== " ") {
    word.push(c);
  }
  if (word.length === 0) {
    return [false, ""];
  }
  return [true, word.reverse().join("")];
}

// TODO query should be custom
function useQuery(): (searchText: string) => SearchPromise {
  return useCallback((searchText: string) => {
    const server = new AutocompleteServer();
    console.time("query");
    const response = server.query(searchText);
    console.timeEnd("query");
    return response;
  }, []);
}

function formatSuggestionText(suggestion: string): string {
  const userAgentData = window.navigator.userAgentData;
  const isMobile =
    userAgentData !== undefined
      ? userAgentData.mobile
      : window.innerWidth <= 800 && window.innerHeight <= 600;

  return `${suggestion} ${isMobile ? "(SWIPE \u2B95)" : "(TAB)"}`;
}

export default function AutocompletePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const query = useQuery();

  useEffect(() => {
    let autocompleteNodeKey: null | NodeKey = null;
    let lastMatch: null | string = null;
    let lastSuggestion: null | string = null;
    let searchPromise: null | SearchPromise = null;
    let prevNodeFormat: number = 0;
    function $clearSuggestion() {
      const autocompleteNode =
        autocompleteNodeKey !== null
          ? $getNodeByKey(autocompleteNodeKey)
          : null;
      if (autocompleteNode !== null && autocompleteNode.isAttached()) {
        autocompleteNode.remove();
        autocompleteNodeKey = null;
      }
      if (searchPromise !== null) {
        searchPromise.dismiss();
        searchPromise = null;
      }
      lastMatch = null;
      lastSuggestion = null;
      prevNodeFormat = 0;
    }
    function updateAsyncSuggestion(
      refSearchPromise: SearchPromise,
      newSuggestion: null | string,
    ) {
      if (searchPromise !== refSearchPromise || newSuggestion === null) {
        // Outdated or no suggestion
        return;
      }
      editor.update(() => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);
        if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
          // Outdated
          return;
        }
        const selectionCopy = selection.clone();
        const prevNode = selection.getNodes()[0] as TextNode;
        prevNodeFormat = prevNode.getFormat();
        const node = $createAutocompleteNode(
          formatSuggestionText(newSuggestion),
          uuid,
        )
          .setFormat(prevNodeFormat)
          // .setStyle(`font-size: ${toolbarState.fontSize}`);
          .setStyle(`font-size: 1em`);
        autocompleteNodeKey = node.getKey();
        selection.insertNodes([node]);
        $setSelection(selectionCopy);
        lastSuggestion = newSuggestion;
      }, HISTORY_MERGE);
    }

    function $handleAutocompleteNodeTransform(node: AutocompleteNode) {
      const key = node.getKey();
      if (node.__uuid === uuid && key !== autocompleteNodeKey) {
        // Max one Autocomplete node per session
        $clearSuggestion();
      }
    }
    function handleUpdate() {
      editor.update(() => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);
        if (!hasMatch) {
          $clearSuggestion();
          return;
        }
        if (match === lastMatch) {
          return;
        }
        $clearSuggestion();
        searchPromise = query(match);
        searchPromise.promise
          .then((newSuggestion) => {
            if (searchPromise !== null) {
              updateAsyncSuggestion(searchPromise, newSuggestion);
            }
          })
          .catch((e) => {
            if (e !== "Dismissed") {
              console.error(e);
            }
          });
        lastMatch = match;
      }, HISTORY_MERGE);
    }
    function $handleAutocompleteIntent(): boolean {
      if (lastSuggestion === null || autocompleteNodeKey === null) {
        return false;
      }
      const autocompleteNode = $getNodeByKey(autocompleteNodeKey);
      if (autocompleteNode === null) {
        return false;
      }
      const textNode = $createTextNode(lastSuggestion)
        .setFormat(prevNodeFormat)
        .setStyle(`font-size: 1em`);
      autocompleteNode.replace(textNode);
      textNode.selectNext();
      $clearSuggestion();
      return true;
    }
    function $handleKeypressCommand(e: Event) {
      if ($handleAutocompleteIntent()) {
        e.preventDefault();
        return true;
      }
      return false;
    }
    function unmountSuggestion() {
      editor.update(() => {
        $clearSuggestion();
      }, HISTORY_MERGE);
    }

    return mergeRegister(
      editor.registerNodeTransform(
        AutocompleteNode,
        $handleAutocompleteNodeTransform,
      ),
      editor.registerUpdateListener(handleUpdate),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW,
      ),
      unmountSuggestion,
    );
  }, [editor, query]);

  return null;
}

/*
 * Simulate an asynchronous autocomplete server (typical in more common use cases like GMail where
 * the data is not static).
 */
class AutocompleteServer {
  // DATABASE = [];
  LATENCY = 200;

  private async findByName(name: string) {
    const d = await getApi().playerApi.playerControllerSearch(name, 5);
    // return d.data!;
    return "amogus";
  }

  query = (searchText: string): SearchPromise => {
    let isDismissed = false;

    const dismiss = () => {
      isDismissed = true;
    };
    const promise: Promise<null | string> = new Promise(
      async (resolve, reject) => {
        if (isDismissed) {
          // TODO cache result
          return reject("Dismissed");
        }
        const searchTextLength = searchText.length;
        if (searchText === "" || searchTextLength < 4) {
          return resolve(null);
        }
        const match = await this.findByName(searchText);
        if (match === undefined) {
          return resolve(null);
        }
        const autocompleteChunk = match.substring(searchTextLength);
        if (autocompleteChunk === "") {
          return resolve(null);
        }
        return resolve(autocompleteChunk);
      },
    );

    return {
      dismiss,
      promise,
    };
  };
}
