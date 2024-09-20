import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import c from "./AcceptGameModal.module.scss";
import cx from "classnames";
import { MatchmakingMode } from "@/const/enums";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components";
import { FaCheck, FaCopy } from "react-icons/fa6";

const CopySomething = ({ something }: { something: string }) => {
  const [copied, setCopied] = useState(false);
  const [cancelTimeout, setCancelTimeout] = useState<number | undefined>(
    undefined,
  );

  const onCopy = useCallback((text: string, success: boolean) => {
    if (success) {
      if (cancelTimeout) {
        clearTimeout(cancelTimeout);
      }

      setCopied(true);
    }
  }, []);

  return (
    <CopyToClipboard text={something} onCopy={onCopy}>
      <div className={c.copyHolder}>
        <Input id="copy" readOnly className="iso" value={something} />
        {copied ? <FaCheck className={c.successCopy} /> : <FaCopy />}
      </div>
    </CopyToClipboard>
  );
};

export const AcceptGameModal = observer(() => {
  // const q = useStore().queue;

  const q = {
    isSearchingServer: false,
    gameInfo: {
      mode: MatchmakingMode.SOLOMID,
      accepted: 1,
      total: 2,
      roomID: "asdfasfsadfasf",
      iAccepted: false,
      serverURL: "fsdf",
    },
  };

  if (q.isSearchingServer)
    return (
      <div className={c.modalWrapper}>
        <div className={c.modal}>
          <h2>Идет поиск сервера...</h2>
        </div>
      </div>
    );

  if (q.gameInfo?.serverURL)
    return (
      <div className={cx(c.modal, c.inline)}>
        <h2>Игра готова!</h2>
        <div className={c.buttons}>
          <a
            className={c.button2}
            target={"__blank"}
            href={`steam://connect/${q.gameInfo?.serverURL}`}
          >
            Подключиться к игре
          </a>
        </div>
        <CopySomething something={`connect ${q.gameInfo?.serverURL}`} />
      </div>
    );

  return <></>;
});
