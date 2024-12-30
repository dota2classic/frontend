import c from "@/components/Message/Message.module.scss";
import cx from "clsx";
import { IMessageProps } from "@/components/Message/MessageProps";
import { RichMessage } from "@/components/Thread/RichMessage";
import React from "react";
import { MessageTools } from "@/components/Message/MessageTools";
import { MessageReactions } from "@/components/Message/MessageReactions";
import { observer } from "mobx-react-lite";

export const FollowupMessage = React.memo(
  observer(({ message }: IMessageProps) => {
    return (
      <div className={c.contentWrapper}>
        <div className={cx(c.contentWrapper__left, c.time)}>
          {new Date(message.createdAt).toTimeString().slice(0, 5)}
        </div>
        <div className={c.contentWrapper__middle}>
          <div className={cx(c.content)}>
            <MessageTools messageId={message.messageId} />
            <RichMessage rawMsg={message.content} />
          </div>
          <MessageReactions
            messageId={message.messageId}
            reactions={message.reactions}
          />
        </div>
      </div>
    );
  }),
);
