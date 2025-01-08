import React, { useCallback, useContext } from "react";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { FaReply } from "react-icons/fa";

interface IReplyToMessageToolProps {
  messageId: string;
}

export const ReplyToMessageTool = React.memo(function ReplyToMessageTool({
  messageId,
}: IReplyToMessageToolProps) {
  const { thread } = useContext(ThreadContext);
  const setReplyMessage = useCallback(() => {
    thread.setReplyMessageId(messageId);
  }, [messageId, thread]);

  return <FaReply onClick={setReplyMessage} />;
});
