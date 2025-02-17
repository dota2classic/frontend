import { observer } from "mobx-react-lite";
import { Panel, PlayerAvatar } from "@/components";
import cx from "clsx";
import c from "./MessageInput.module.scss";
import { IoSend } from "react-icons/io5";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AddEmoticonButton } from "./AddEmoticonButton";
import { MdClose } from "react-icons/md";
import { ThreadMessageDTO } from "@/api/back";
import { useGreedyFocus } from "@/util/useTypingCallback";

export const MessageInput = observer(function MessageInput(p: {
  canMessage: boolean;
  onMessage: (content: string) => Promise<void>;
  className?: string;

  onEscape?: () => void;
  replyMessage?: ThreadMessageDTO;
  cancelReply?: () => void;
  greedyFocus?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");

  useGreedyFocus(p.greedyFocus, textareaRef);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        p.onEscape?.();
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [p]);

  const isValid = value.trim().length >= 2;

  const submit = useCallback(() => {
    if (!isValid) {
      setError("Слишком короткое сообщение!");
      return;
    }
    // Do it optimistically, first
    const msg = value;
    setValue("");

    p.onMessage(msg).catch((err) => {
      if (err.status === 403) {
        setError("Вам запрещено отправлять сообщения!");
      } else {
        setError("Слишком часто отправляете сообщения!");
      }
      setValue(msg);
    });
  }, [isValid, p, value]);

  const onEnterKeyPressed = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        // enter
        submit();
      }
    },
    [submit],
  );

  const insertAtCursor = useCallback(
    (insert: string) => {
      const myField = textareaRef.current;
      if (!myField) return;
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        insert +
        myField.value.substring(endPos, myField.value.length);

      setValue(myField.value);
    },
    [p],
  );

  return (
    <Panel className={cx(c.createMessageContainer, p.className)}>
      {p.replyMessage && (
        <div className={c.replyMessage}>
          Ответ на сообщение{" "}
          <PlayerAvatar
            src={p.replyMessage.author.avatar}
            width={20}
            height={20}
            alt={""}
          />
          <span className={c.replyMessage__name}>
            {p.replyMessage.author.name}
          </span>
          <MdClose onClick={p.cancelReply} />
        </div>
      )}
      <div className={cx(c.createMessage, p.className)}>
        <textarea
          rows={1}
          // autoFocus
          ref={textareaRef}
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
            setValue(e.target.value);
          }}
        />

        <div className={c.buttons}>
          <button className={c.buttonWrapper}>
            <AddEmoticonButton
              onAddReaction={(emo) => {
                insertAtCursor(` :${emo.code}: `);
              }}
            />
          </button>
          <button className={c.buttonWrapper}>
            <IoSend className={error ? "red" : undefined} onClick={submit} />
          </button>
        </div>
      </div>
      <div className={cx(c.test, error && c.visible)}>{error || ""}</div>
    </Panel>
  );
});
