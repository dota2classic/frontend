import { GroupedMessages } from "@/containers/Thread/threads";
import { Message } from "@/components";
import React from "react";

export const RowRenderer = (index: number, msg: GroupedMessages) => {
  return <Message messages={msg.messages} />;
};
