/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { clientStoreManager } from "@/store/ClientStoreManager";

export type EmojiMatch = Readonly<{
  position: number;
  code: string;
  src: string;
}>;

/**
 * Finds emoji shortcodes in text and if found - returns its position in text, matched shortcode and unified ID
 */
export default function findEmoji(text: string): EmojiMatch | null {
  const skippedText: string[] = [];

  const emos = clientStoreManager.getRootStore()!.threads.emoticons;

  for (const word of text.split(" ")) {
    const isEmoticon =
      word.length > 2 && word[0] === ":" && word[word.length - 1] === ":";
    const matchedEmoticon =
      isEmoticon &&
      emos.find(
        (emoticon) => emoticon.code === word.substring(1, word.length - 1),
      );
    if (!matchedEmoticon) {
      skippedText.push(word);
      continue;
    }
    if (skippedText.length > 0) {
      // Compensate for space between skippedText and word
      skippedText.push("");
    }

    return {
      position: skippedText.join(" ").length,
      code: matchedEmoticon.code,
      src: matchedEmoticon.src,
    };
  }

  return null;
}
