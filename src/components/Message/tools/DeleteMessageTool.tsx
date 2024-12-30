import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ThreadContext } from "@/util/threads";
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
  messageId: string;
}
export const DeleteMessageTool = React.memo(
  observer(function DeleteMessageTool({ messageId }: Props) {
    const { auth } = useStore();
    const { thread } = useContext(ThreadContext);

    if (!auth.isAdmin && !auth.isModerator) return null;

    return <FaRegTrashAlt onClick={() => thread.deleteMessage(messageId)} />;
  }),
);
