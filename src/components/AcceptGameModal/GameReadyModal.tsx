import cx from "clsx";
import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { Button, CopySomething, Input } from "@/components";
import { useLocalStorageBackedParam } from "@/util/useLocalStorageBackedParam";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

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
          <Button
            mega
            small
            onClick={async () => {
              const doAbandon = confirm(
                "Ты действительно хочешь покинуть эту игру?",
              );
              if (doAbandon) {
                await q.abandon();
              }
            }}
          >
            <IoClose />
          </Button>
        </div>
        <CopySomething
          something={`connect ${q.gameState?.serverUrl}`}
          placeholder={
            <Input
              value={`connect ${q.gameState?.serverUrl}`}
              readOnly={true}
            />
          }
        />
        <div className={c.fullInstruction}>
          <div className={cx(c.guide, fullGuide && c.guide__visible)}>
            Порядок действий:
            <ol>
              <li>Убедись, что запущен steam.</li>
              <li>Убедись, что запущен наш клиент игры.</li>
              <li>
                Используй консольную команду для подключения к игровому серверу
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
