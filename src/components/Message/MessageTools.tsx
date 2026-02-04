import React from "react";
import c from "./Message.module.scss";
import { AddReactionTool } from "./tools/AddReactionTool";
import { DeleteMessageTool } from "./tools/DeleteMessageTool";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { AddSpecificReactionTool } from "./tools/AddSpecificReactionTool";
import { ReplyToMessageTool } from "./tools/ReplyToMessageTool";
import { EditMessageTool } from "./tools/EditMessageTool";
import { ThreadMessageDTO } from "@/api/back";
import { BlockUserTool } from "./tools/BlockUserTool";
import { ReportUserTool } from "./tools/ReportUserTool";
import { PinMessageTool } from "@/components/Message/tools/PinMessageTool";

interface Props {
  message: ThreadMessageDTO;
}

export const MessageTools = observer(({ message }: Props) => {
  const {
    threads: { emoticons },
  } = useStore();

  return (
    <div className={c.tools}>
      {emoticons.slice(0, 3).map((emoticon) => (
        <AddSpecificReactionTool
          messageId={message.messageId}
          key={emoticon.code}
          emoticon={emoticon}
        />
      ))}
      <AddReactionTool messageId={message.messageId} />
      <ReplyToMessageTool messageId={message.messageId} />
      <EditMessageTool message={message} />
      <DeleteMessageTool messageId={message.messageId} />
      <BlockUserTool
        blockStatus={message.blocked}
        relatedSteamId={message.author.steamId}
      />
      <ReportUserTool message={message} />
      <PinMessageTool messageId={message.messageId} />
    </div>
  );
});
