import { useCallback, useMemo } from "react";
import { ThreadStore } from "@/store/ThreadStore";
import { useStore } from "@/store";

export const useThreadControls = (
  thread: ThreadStore,
): [(msg: string) => Promise<void>, () => void, boolean] => {
  const { auth } = useStore();
  const sendMessage = useCallback(
    (msg: string) => {
      return thread
        .sendMessage(msg, thread.replyingMessageId)
        .then(() => thread.setReplyMessageId(undefined));
    },
    [thread],
  );

  const clearReply = useCallback(() => {
    thread.setReplyMessageId(undefined);
  }, [thread]);

  const canMessage: boolean = useMemo(() => {
    return !!auth.parsedToken;
  }, [auth.parsedToken]);

  return [sendMessage, clearReply, canMessage];
};
