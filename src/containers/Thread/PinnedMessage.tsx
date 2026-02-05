import c from "@/containers/Thread/Thread.module.scss";
import { Message } from "@/components/Message";
import React, { useCallback, useMemo, useState } from "react";
import { ThreadMessageDTO } from "@/api/back";

interface Props {
  message?: ThreadMessageDTO;
}
export const PinnedMessage = ({ message }: Props) => {
  const [pinHovered, setPinHovered] = useState(false);

  const hoveredMessage = useMemo<ThreadMessageDTO | undefined>(() => {
    if (!message) return undefined;
    const msg: ThreadMessageDTO = { ...message };
    if (!pinHovered) {
      msg.reactions = [];
    }
    return msg;
  }, [pinHovered, message]);

  const hover = useCallback(() => {
    setPinHovered(true);
  }, [setPinHovered]);

  const leave = useCallback(() => {
    setPinHovered(false);
  }, [setPinHovered]);

  if (!hoveredMessage) return null;

  return (
    <div className={c.pinnedMessage} onMouseEnter={hover} onMouseLeave={leave}>
      <span className={c.pinnedMessage__indicator}>Закреплено</span>
      <Message header={true} lightweight message={hoveredMessage} />
    </div>
  );
};
