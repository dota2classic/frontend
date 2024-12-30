import { observer } from "mobx-react-lite";
import { EmoticonDto, ThreadMessageDTO } from "@/api/back";
import { useThrottle } from "@/util/throttle";
import { getApi } from "@/api/hooks";
import { EmoticonSelectWindow, Panel } from "@/components";
import cx from "clsx";
import c from "@/components/Thread/Thread.module.scss";
import { IoSend } from "react-icons/io5";
import React, { useCallback, useRef, useState } from "react";
import { FaRegFaceGrinTongueSquint } from "react-icons/fa6";
import { createPortal } from "react-dom";

interface Props {
  onAddReaction: (e: EmoticonDto) => void;
}

const AddEmoticonButton = React.memo(function AddReactionTool({
  onAddReaction,
}: Props) {
  const emoticonAnchorRef = useRef<HTMLElement | null>(null);

  const [visible, setVisible] = useState(false);

  const react = useCallback(onAddReaction, [onAddReaction]);

  const showEmoticonWindow = useCallback(() => {
    if (!emoticonAnchorRef.current) return;

    setVisible(true);
  }, []);

  return (
    <>
      <span ref={emoticonAnchorRef}>
        <FaRegFaceGrinTongueSquint onClick={showEmoticonWindow} />
      </span>
      {visible &&
        createPortal(
          <EmoticonSelectWindow
            onSelect={react}
            anchor={emoticonAnchorRef}
            onClose={() => setVisible(false)}
          />,
          document.body,
        )}
    </>
  );
});

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
            <IoSend
              className={error ? "red" : undefined}
              onClick={throttledSubmit}
            />
          </button>
        </div>
      </div>
      <div className={cx(c.test, error && c.visible)}>{error || ""}</div>
    </Panel>
  );
});
