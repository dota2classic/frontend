import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import c from "./AcceptGameModal.module.scss";
import cx from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useStore } from "@/store";
import { formatGameMode } from "@/util/gamemode";

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

export const AcceptGameModal = observer(() => {
  const qStore = useStore().queue;
  const q = qStore;

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

  if (!q.gameInfo) return null;

  if (!q.gameInfo.iAccepted)
    return (
      <div className={c.modalWrapper}>
        <div className={c.modal}>
          <div className={c.header}>
            <h4>Ваша игра готова</h4>
            <h3>{formatGameMode(q.gameInfo.mode)}</h3>
          </div>
          <div className={c.buttons}>
            <button
              className={cx(c.button2, c.accept)}
              onClick={qStore.acceptGame}
            >
              Принять
            </button>
            <button
              className={cx(c.button2, c.decline)}
              onClick={qStore.declineGame}
            >
              Отклонить
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className={c.modalWrapper}>
      <div className={c.modal}>
        <div className={c.header}>
          <h4>Ожидаем остальных игроков</h4>
          <h3>
            {q.gameInfo?.accepted === undefined ? 0 : q.gameInfo!.accepted} из{" "}
            {q.gameInfo.total}...
          </h3>
        </div>
        <div className={c.dots}>
          {new Array(q.gameInfo.total).fill(null).map((_, t) => (
            <div
              key={t}
              className={t < q.gameInfo!.accepted ? c.acceptedDot : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
