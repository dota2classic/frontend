import React, { useCallback, useContext } from "react";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { FaReply } from "react-icons/fa";

interface IReplyToMessageToolProps {
  messageId: string;
}

export const ReplyToMessageTool = React.memo(function ReplyToMessageTool({
  messageId,
}: IReplyToMessageToolProps) {
  const { input } = useContext(ThreadContext);
  const setReplyMessage = useCallback(() => {
    input.setReplyMessageId(messageId);
  }, [messageId, input]);

  return <FaReply onClick={setReplyMessage} />;
});
