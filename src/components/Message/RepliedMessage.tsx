import { ThreadMessageDTO } from "@/api/back";
import c from "./Message.module.scss";
import { PlayerAvatar } from "@/components";

interface IRepliedMessageProps {
  message?: ThreadMessageDTO;
}

export const RepliedMessage = ({ message }: IRepliedMessageProps) => {
  if (!message) return null;
  return (
    <div className={c.repliedMessage}>
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
};
