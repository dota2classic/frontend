import React from "react";

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

// function useBasicTypeaheadTriggerMatch(trigger: string, {
//   minLength = 1,
//   maxLength = 75
// }) {
//   return React.useCallback(text => {
//     const validChars = '[^' + trigger + PUNCTUATION + '\\s]';
//     const TypeaheadTriggerRegex = new RegExp('(^|\\s|\\()(' + '[' + trigger + ']' + '((?:' + validChars + '){0,' + maxLength + '})' + ')$');
//     const match = TypeaheadTriggerRegex.exec(text);
//     if (match !== null) {
//       const maybeLeadingWhitespace = match[1];
//       const matchingString = match[3];
//       if (matchingString.length >= minLength) {
//         return {
//           leadOffset: match.index + maybeLeadingWhitespace.length,
//           matchingString,
//           replaceableString: match[2]
//         };
//       }
//     }
//     return null;
//   }, [maxLength, minLength, trigger]);
// }
