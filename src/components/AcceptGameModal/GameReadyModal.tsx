import cx from "clsx";
import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input } from "@/components";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useLocalStorageBackedParam } from "@/util/useLocalStorageBackedParam";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const CopySomething = ({ something }: { something: string }) => {
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

export const GameReadyModal = observer(
  ({ className }: { className?: string }) => {
    const q = useStore().queue;

    const [fullGuide, setFullGuide] = useLocalStorageBackedParam<boolean>(
      "d2c:show_connect_guide",
      true,
    );

    const toggleInfo = useCallback(() => {
      setFullGuide(!fullGuide);
    }, [fullGuide]);

    if (!q.gameState) return null;

    return (
      <div className={className} data-testid="game-ready-modal">
        <h2>Игра готова!</h2>
        <div className={c.connectInfo}>
          <a
            className={cx(c.button2, c.accept)}
            target={"__blank"}
            href={`steam://connect/${q.gameState?.serverUrl}`}
          >
            Подключиться к игре
          </a>
        </div>
        <CopySomething something={`connect ${q.gameState?.serverUrl}`} />
        <div className={c.fullInstruction}>
          <div className={cx(c.guide, fullGuide && c.guide__visible)}>
            Порядок действий:
            <ol>
              <li>Убедись, что запущен steam.</li>
              <li>Убедись, что запущен наш клиент игры.</li>
              <li>
                Нажми на кнопку "подключиться" / Используй консольную команду
                под ней.
              </li>
              <li>Не получается? Пиши в чат, постараемся помочь</li>
            </ol>
          </div>
          <Button onClick={toggleInfo} className={c.toggleInfo}>
            {fullGuide ? (
              <>
                Скрыть <FaEyeSlash />
              </>
            ) : (
              <>
                Гайд для подключения <FaEye />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  },
);
