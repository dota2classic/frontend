import cx from "clsx";
import c from "@/components/Message/Message.module.scss";
import React from "react";
import { MdBlock } from "react-icons/md";

interface Props {
  onShowBlockedMessage: () => void;
}

export const BlockedMessage = React.memo(function BlockedMessage({
  onShowBlockedMessage,
}: Props) {
  return (
    <div className={cx(c.contentWrapper)}>
      <div className={cx(c.contentWrapper__left, c.blockedMessage)}></div>
      <div className={cx(c.contentWrapper__middle)}>
        <div className={cx(c.content)}>
          <span onClick={onShowBlockedMessage} className={c.showBlockedMessage}>
            <MdBlock />
            Заблокированное сообщение
          </span>
        </div>
      </div>
    </div>
  );
});
