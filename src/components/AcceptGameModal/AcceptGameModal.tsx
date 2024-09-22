import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import c from "./AcceptGameModal.module.scss";
import cx from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useStore } from "@/store";

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
  const qStore = useStore().queue;
  const q = qStore;

  console.log("Render accept game modal!", JSON.stringify(q.gameInfo));

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

  if (!q.gameInfo) return null;

  if (!q.gameInfo.iAccepted)
    return (
      <div className={c.modalWrapper}>
        <div className={c.modal}>
          <h2>Игра найдена!</h2>
          <div className={c.buttons}>
            <button className={c.button2} onClick={qStore.acceptGame}>
              Принять игру
            </button>
            <button className={c.button2} onClick={qStore.declineGame}>
              Отклонить игру
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className={c.modalWrapper}>
      <div className={c.modal}>
        <h2>
          Ожидаем остальных игроков <br />{" "}
          {q.gameInfo!!.accepted === undefined ? 0 : q.gameInfo!!.accepted} из{" "}
          {q.gameInfo.total}...
        </h2>
        <div className={c.dots}>
          {new Array(q.gameInfo.total).fill(null).map((_, t) => (
            <div
              key={t}
              className={t < q.gameInfo!!.accepted ? c.acceptedDot : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
