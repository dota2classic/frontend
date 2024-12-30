import React from "react";
import c from "./Message.module.scss";
import { AddReactionTool } from "@/components/Message/tools/AddReactionTool";
import { DeleteMessageTool } from "@/components/Message/tools/DeleteMessageTool";

interface Props {
  messageId: string;
}

export const MessageTools = React.memo(function MessageTools({
  messageId,
}: Props) {
  return (
    <div className={c.tools}>
      <AddReactionTool messageId={messageId} />
      <DeleteMessageTool messageId={messageId} />
    </div>
  );
});
