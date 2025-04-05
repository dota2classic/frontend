import React, { ReactNode, useCallback, useState } from "react";

import c from "./CopySomething.module.scss";
import { FaCheck, FaCopy } from "react-icons/fa6";

interface ICopySomethingProps {
  something: string;
  placeholder?: ReactNode;
  className?: string;
}

export const CopySomething = ({
  something,
  placeholder,
  className,
}: ICopySomethingProps) => {
  const [copied, setCopied] = useState(false);
  const [cancelTimeout, setCancelTimeout] = useState<number | undefined>(
    undefined,
  );

  const onCopy = useCallback(
    (text: string, success: boolean) => {
      if (success) {
        if (cancelTimeout) {
          clearTimeout(cancelTimeout);
        }

        setCopied(true);
        setCancelTimeout(
          setTimeout(() => setCopied(false), 1000) as unknown as number,
        );
      }
    },
    [cancelTimeout],
  );

  return (
    <div
      className={c.copyHolder}
      onClick={() =>
        navigator.clipboard
          .writeText(something)
          .then(() => onCopy(something, true))
      }
    >
      <span className={className} style={{ display: "flex", flex: 1 }}>
        {placeholder || something}
      </span>
      {copied ? <FaCheck className={c.successCopy} /> : <FaCopy />}
    </div>
  );
};
