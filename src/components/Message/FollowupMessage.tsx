import c from "@/components/Message/Message.module.scss";
import cx from "clsx";
import { MessageControls } from "@/components/Message/MessageControls";
import { IMessageProps } from "@/components/Message/MessageProps";
import { enrichMessage } from "@/components/Thread/richMessage";

export const FollowupMessage = ({
  message,
  onDelete,
  onMute,
}: IMessageProps) => {
  return (
    <div className={c.contentWrapper}>
      <div className={cx(c.contentWrapper__left, c.time)}>
        {new Date(message.createdAt).toTimeString().slice(0, 5)}
      </div>
      <div className={c.contentWrapper__middle}>
        <div className={cx(c.content)}>{enrichMessage(message.content)}</div>
      </div>

      <MessageControls onMute={onMute} onDelete={onDelete} />
    </div>
  );
};
