/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { LexicalNode, TextNode } from "lexical";
import * as ReactDOM from "react-dom";
import cx from "clsx";
import c from "../PlayerMentionPlugin/Mention.module.scss";
import { MentionSelectionListItem } from "@/containers/RichEditor/plugins/GenericMentionPlugin/MentionSelectionListItem";
import { GenericTooltip } from "@/components";

function useMentionLookupService<T>(
  provide: (search: string) => Promise<T[]>,
  mentionString: string | null,
) {
  const [results, setResults] = useState<T[]>([]);
  const mentionsCache = useRef<Map<string, T[]>>(new Map());

  useEffect(() => {
    if (mentionString === null) return;
    const cachedResults = mentionsCache.current.get(mentionString);

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.current.delete(mentionString);
    provide(mentionString).then((newResults) => {
      mentionsCache.current.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString, provide]);

  return results;
}

class MentionTypeaheadOption<T> extends MenuOption {
  constructor(
    public readonly dto: T,
    key: string,
  ) {
    super(key);
  }
}

interface RenderItemProps<T> {
  option: T;
}

interface MentionPluginProps<T> {
  RenderListItem: React.FC<RenderItemProps<T>>;
  searchProvider: (part: string) => Promise<T[]>;
  suggestionLimit: number;
  $createNode: (t: T) => LexicalNode;
  keyProvider: (t: T) => string;
  trigger: string;
}
export default function GenericMentionPlugin<T>({
  searchProvider,
  RenderListItem,
  suggestionLimit,
  $createNode,
  keyProvider,
  trigger,
}: MentionPluginProps<T>): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(searchProvider, queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch(trigger, {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new MentionTypeaheadOption<T>(result, keyProvider(result)),
        )
        .slice(0, suggestionLimit),
    [keyProvider, results, suggestionLimit],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption<T>,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createNode(selectedOption.dto);

        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        closeMenu();
      });
    },
    [$createNode, editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      return checkForSlashTriggerMatch(text, editor);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionSelectionListItem>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <GenericTooltip
                anchor={anchorElementRef.current!}
                onClose={() => {}}
              >
                <div className={cx(c.typeaheadPopover, c.mentionsMenu)}>
                  <ul>
                    {options.map((option, i: number) => (
                      <MentionSelectionListItem
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
                      >
                        <RenderListItem option={option.dto} />
                      </MentionSelectionListItem>
                    ))}
                  </ul>
                </div>
              </GenericTooltip>,
              document.body,
            )
          : null
      }
    />
  );
}
