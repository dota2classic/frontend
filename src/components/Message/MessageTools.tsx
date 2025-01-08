import React from "react";
import c from "./Message.module.scss";
import { AddReactionTool } from "@/components/Message/tools/AddReactionTool";
import { DeleteMessageTool } from "@/components/Message/tools/DeleteMessageTool";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { AddSpecificReactionTool } from "@/components/Message/tools/AddSpecificReactionTool";
import { ReplyToMessageTool } from "@/components/Message/tools/ReplyToMessageTool";

interface Props {
  messageId: string;
}

export const MessageTools = observer(({ messageId }: Props) => {
  const { emoticons } = useStore().threads;

  return (
    <div className={c.tools}>
      {emoticons.slice(0, 3).map((emoticon) => (
        <AddSpecificReactionTool
          messageId={messageId}
          key={emoticon.code}
          emoticon={emoticon}
        />
      ))}
      <AddReactionTool messageId={messageId} />
      <ReplyToMessageTool messageId={messageId} />
      <DeleteMessageTool messageId={messageId} />
    </div>
  );
});
