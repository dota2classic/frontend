import { EmoticonDto } from "@/api/back";
import React, { useCallback, useContext } from "react";
import { Emoticon } from "@/components/Emoticon";
import { ThreadContext } from "@/containers/Thread/threadContext";

interface IAddSpecificReactionToolProps {
  emoticon: EmoticonDto;
  messageId: string;
}

export const AddSpecificReactionTool = ({
  emoticon,
  messageId,
}: IAddSpecificReactionToolProps) => {
  const thread = useContext(ThreadContext);
  const react = useCallback(() => {
    thread.react(messageId, emoticon.id);
  }, [thread, messageId, emoticon]);
  return (
    <span onClick={react}>
      <Emoticon code={emoticon.code} />
    </span>
  );
};
