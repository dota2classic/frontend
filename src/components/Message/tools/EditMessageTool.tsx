import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { FaPencil } from "react-icons/fa6";
import { ThreadMessageDTO } from "@/api/back";

interface Props {
  message: ThreadMessageDTO;
}
export const EditMessageTool = observer(function EditMessageTool({
  message,
}: Props) {
  const { auth } = useStore();
  const thread = useContext(ThreadContext);

  const editMessage = useCallback(() => {
    thread.setEditMessage(message.messageId);
  }, [thread, message.messageId]);

  if (message?.author?.steamId !== auth.parsedToken?.sub) return null;

  return <FaPencil onClick={editMessage} />;
});
