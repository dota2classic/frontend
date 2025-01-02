import React, { useCallback, useState } from "react";

import { Input } from "..";

import c from "./CopySomething.module.scss";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCheck, FaCopy } from "react-icons/fa6";

interface ICopySomethingProps {
  something: string;
}

export const CopySomething = ({ something }: ICopySomethingProps) => {
  const [copied, setCopied] = useState(false);
  const [cancelTimeout] = useState<number | undefined>(undefined);

  const onCopy = useCallback(
    (text: string, success: boolean) => {
      if (success) {
        if (cancelTimeout) {
          clearTimeout(cancelTimeout);
        }

        setCopied(true);
      }
    },
    [cancelTimeout],
  );

  return (
    <CopyToClipboard text={something} onCopy={onCopy}>
      <div className={c.copyHolder}>
        <Input
          id="copy"
          readOnly
          className="iso"
          value={something}
          data-testid="copy-something"
        />
        {copied ? <FaCheck className={c.successCopy} /> : <FaCopy />}
      </div>
    </CopyToClipboard>
  );
};
