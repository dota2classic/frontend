import { ThreadMessageDTO } from "@/api/back";
import c from "./Message.module.scss";
import { PlayerAvatar } from "@/components";
import { useCallback, useContext } from "react";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { observer } from "mobx-react-lite";

interface IRepliedMessageProps {
  message?: ThreadMessageDTO;
}

export const RepliedMessage = observer(function RepliedMessage({
  message,
}: IRepliedMessageProps) {
  const { input } = useContext(ThreadContext);
  const scrollRepliedMessage = useCallback(() => {
    if (!message) return;
    input.scrollIntoView(message.messageId);
  }, [input, message]);
  if (!message) return null;

  return (
    <div className={c.repliedMessage} onClick={scrollRepliedMessage}>
      <span className={c.repliedMessage__indicator} />
      <PlayerAvatar
        src={message.author.avatar}
        alt={""}
        width={20}
        height={20}
      />
      <span className={c.repliedMessage__content}>{message.content}</span>
    </div>
  );
});
