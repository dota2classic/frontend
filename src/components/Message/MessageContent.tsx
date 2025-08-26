import { MessageInput, RichMessage } from "@/components";
import c from "@/components/Message/Message.module.scss";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { ThreadMessageDTO } from "@/api/back";
import { observer } from "mobx-react-lite";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { useTranslation } from "react-i18next";

interface Props {
  message: ThreadMessageDTO;
}
export const MessageContent = observer(({ message }: Props) => {
  const thread = useContext(ThreadContext);
  const { t } = useTranslation();

  const [value, setValue] = useState(message.content);

  useEffect(() => {
    setValue(message.content);
  }, [message.content, thread.editingMessageId]);

  const cancelEdit = useCallback(() => {
    thread.setEditMessage(undefined);
  }, [thread]);

  const editMessage = useCallback(
    (content: string) => {
      return thread
        .editMessage(message.messageId, content)
        .then(() => thread.setEditMessage(undefined));
    },
    [message.messageId, thread],
  );

  return thread.editingMessageId === message.messageId ? (
    <>
      <MessageInput
        greedyFocus={GreedyFocusPriority.FORUM_EDIT_MESSAGE}
        onEscape={cancelEdit}
        canMessage
        onMessage={editMessage}
        value={value}
        setValue={setValue}
      />
      <span className={c.edited}>
        <span className="gold">{t("message_content.escape")}</span>{" "}
        {t("message_content.forCancel")},
        <span className="gold">{t("message_content.enter")}</span>{" "}
        {t("message_content.forSave")}
      </span>
    </>
  ) : (
    <div className={c.richContent}>
      <RichMessage rawMsg={message.content} />
      {message.edited && (
        <span className={c.edited}>({t("message_content.edited")})</span>
      )}
    </div>
  );
});
