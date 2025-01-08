import { observer } from "mobx-react-lite";
import { ThreadMessageDTO } from "@/api/back";
import { Panel, PlayerAvatar } from "@/components";
import cx from "clsx";
import c from "./MessageInput.module.scss";
import { IoSend } from "react-icons/io5";
import React, { useCallback, useContext, useRef, useState } from "react";
import { AddEmoticonButton } from "./AddEmoticonButton";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { MdClose } from "react-icons/md";

export const MessageInput = observer(function MessageInput(p: {
  threadId: string;
  canMessage: boolean;
  onMessage: (mgs: ThreadMessageDTO) => void;
  rows: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { thread } = useContext(ThreadContext);

  const isValid = value.trim().length >= 2;

  const submit = useCallback(() => {
    if (!isValid) {
      setError("Слишком короткое сообщение!");
      return;
    }
    // Do it optimistically, first
    const msg = value;
    setValue("");

    thread
      .sendMessage(p.threadId, msg, thread.replyingMessageId)
      .catch((err) => {
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

  const clearReplyMessage = useCallback(() => {
    thread.setReplyMessageId(undefined);
  }, [thread]);

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
    [textareaRef],
  );

  return (
    <Panel className={cx(c.createMessageContainer, p.className)}>
      {thread.replyingMessage && (
        <div className={c.replyMessage}>
          Ответ на сообщение{" "}
          <PlayerAvatar
            src={thread.replyingMessage.author.avatar}
            width={20}
            height={20}
            alt={""}
          />
          <span className={c.replyMessage__name}>
            {thread.replyingMessage.author.name}
          </span>
          <MdClose onClick={clearReplyMessage} />
        </div>
      )}
      <div className={cx(c.createMessage, p.className)}>
        <textarea
          ref={textareaRef}
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
