import { EmoticonDto } from "@/api/back";
import React, { useCallback, useContext } from "react";
import { Emoticon } from "@/components";
import { ThreadContext } from "@/containers/Thread/threadContext";

interface IAddSpecificReactionToolProps {
  emoticon: EmoticonDto;
  messageId: string;
}

export const AddSpecificReactionTool = ({
  emoticon,
  messageId,
}: IAddSpecificReactionToolProps) => {
  const threadCtx = useContext(ThreadContext);
  const react = useCallback(() => {
    threadCtx.thread.react(messageId, emoticon.id);
  }, [threadCtx, messageId, emoticon]);
  return (
    <span onClick={react}>
      <Emoticon code={emoticon.code} />
    </span>
  );
};
