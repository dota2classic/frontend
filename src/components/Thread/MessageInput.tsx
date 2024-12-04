import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { useThrottle } from "@/util/throttle";
import { getApi } from "@/api/hooks";
import { Button, MarkdownTextarea, Panel } from "@/components";
import cx from "clsx";
import c from "@/components/Thread/Thread.module.scss";
import { IoSend } from "react-icons/io5";
import React, { useCallback, useState } from "react";

export const MessageInput = observer(function MessageInput(p: {
  threadId: string;
  canMessage: boolean;
  onMessage: (mgs: ThreadMessageDTO) => void;
  rows: number;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValid = value.trim().length >= 2;

  const throttledSubmit = useThrottle(() => {
    if (!isValid) {
      setError("Слишком короткое сообщение!");
      return;
    }
    // Do it optimistically, first
    const msg = value;
    setValue("");

    getApi()
      .forumApi.forumControllerPostMessage({
        threadId: p.threadId,
        content: msg,
      })
      .then((msg) => {
        setValue("");
        p.onMessage(msg);
      })
      .catch((err) => {
        if (err.status === 403) {
          setError("Вам запрещено отправлять сообщения!");
        } else {
          setError("Слишком часто отправляете сообщения!");
        }
        setValue(msg);
      });
  }, 250);

  const onEnterKeyPressed = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        // enter
        throttledSubmit();
      }
    },
    [throttledSubmit],
  );
  return (
    <Panel className={cx(c.createMessage, p.className)}>
      <MarkdownTextarea
        rows={p.rows}
        readOnly={!p.canMessage}
        onKeyDown={onEnterKeyPressed}
        className={c.text}
        placeholder={
          p.canMessage
            ? "Введите сообщение"
            : "У вас нет прав на отправку сообщений"
        }
        value={value}
        onChange={(e) => {
          setError(null);
          setValue(e.target.value!);
        }}
      />

      {/*<div className={c.markdown}>Поддерживается разметка markdown</div>*/}
      <Button
        disabled={!isValid || !p.canMessage}
        className={(error && "red") || undefined}
        onClick={throttledSubmit}
      >
        {/*{error || "Отправить"}*/}
        {
          <IoSend
            className={error ? "red" : undefined}
            onClick={throttledSubmit}
          />
        }
      </Button>
      <div className={cx(c.test, error && c.visible)}>{error || ""}</div>
    </Panel>
  );
});
