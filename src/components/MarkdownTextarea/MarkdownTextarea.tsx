import React, { useRef } from "react";

import c from "./MarkdownTextarea.module.scss";
import cx from "classnames";
import { FaBold, FaItalic, FaQuoteLeft } from "react-icons/fa";

export const MarkdownTextarea: React.FC<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
> = ({ className, ...props }) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const wrap =
    (start: string, end: string = start) =>
    (e: React.MouseEvent) => {
      const ta = ref.current;
      if (!ta) return;
      e.preventDefault();

      if (ta.selectionEnd === ta.selectionStart) {
        // nothing selected
        ta.focus();
        const some = document.execCommand("insertText", false, start + end);
        console.log(some);
      } else {
        ta.focus();
        // ta.setSelectionRange(ta.selectionStart, ta.selectionEnd);
        const between = ta.value.slice(ta.selectionStart, ta.selectionEnd);
        document.execCommand("insertText", false, start + between + end);
      }
    };

  return (
    <div className={cx(c.markdown, className)}>
      <textarea ref={ref} className={c.textInput} rows={8} {...props} />
      <div className={c.messageTools}>
        <span onClick={wrap("**")}>
          <FaBold />
        </span>
        <span onClick={wrap("*")}>
          <FaItalic />
        </span>
        <span onClick={wrap("> ", "")}>
          <FaQuoteLeft />
        </span>
      </div>
    </div>
  );
};
