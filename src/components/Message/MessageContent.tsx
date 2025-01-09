import { MessageInput, RichMessage } from "@/components";
import c from "@/components/Message/Message.module.scss";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { ThreadMessageDTO } from "@/api/back";
import { observer } from "mobx-react-lite";

interface Props {
  message: ThreadMessageDTO;
}
export const MessageContent = observer(({ message }: Props) => {
  const { thread, input } = useContext(ThreadContext);

  const [value, setValue] = useState(message.content);

  useEffect(() => {
    setValue(message.content);
  }, [message.content]);

  const cancelEdit = useCallback(() => {
    input.setEditMessage(undefined);
  }, [input]);

  const editMessage = useCallback(
    (content: string) => {
      return thread
        .editMessage(message.messageId, content)
        .then(() => input.setEditMessage(undefined));
    },
    [input, message.messageId, thread],
  );

  return input.editingMessageId === message.messageId ? (
    <>
      <MessageInput
        onEscape={cancelEdit}
        canMessage
        onMessage={editMessage}
        value={value}
        onValue={setValue}
      />
      <span className={c.edited}>
        <span className="gold">escape</span> для отмены,{" "}
        <span className="gold">enter</span> для сохранения
      </span>
    </>
  ) : (
    <div className={c.richContent}>
      <RichMessage rawMsg={message.content} />
      {message.edited && <span className={c.edited}>(редактировано)</span>}
    </div>
  );
});
