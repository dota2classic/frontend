import cx from "classnames";
import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components";
import { FaCheck, FaCopy } from "react-icons/fa6";

const CopySomething = ({ something }: { something: string }) => {
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
        <Input id="copy" readOnly className="iso" value={something} />
        {copied ? <FaCheck className={c.successCopy} /> : <FaCopy />}
      </div>
    </CopyToClipboard>
  );
};

export const GameReadyModal = observer(
  ({ className }: { className?: string }) => {
    const q = useStore().queue;

    if (!q.gameInfo?.serverURL) return null;

    return (
      <div className={className}>
        <h2>Игра готова!</h2>
        <div className={c.connectInfo}>
          <a
            className={cx(c.button2, c.accept)}
            target={"__blank"}
            href={`steam://connect/${q.gameInfo?.serverURL}`}
          >
            Подключиться к игре
          </a>
        </div>
        <CopySomething something={`connect ${q.gameInfo?.serverURL}`} />
      </div>
    );
  },
);