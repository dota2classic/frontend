import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { MdBlock } from "react-icons/md";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { ThreadContext } from "@/containers/Thread/threadContext";
import c from "../Message.module.scss";

interface Props {
  relatedSteamId: string;
  blockStatus: boolean;
}
export const BlockUserTool = observer(function BlockUserTool({
  relatedSteamId,
  blockStatus,
}: Props) {
  const { auth } = useStore();
  const thread = useContext(ThreadContext);

  const block = useCallback(async () => {
    if (blockStatus) {
      await getApi().playerApi.playerControllerUnblockPlayer(relatedSteamId);
      thread.setBlockMessagesOf(relatedSteamId, false);
    } else {
      await getApi().playerApi.playerControllerBlockPlayer(relatedSteamId);
      thread.setBlockMessagesOf(relatedSteamId, true);
    }
  }, [blockStatus, relatedSteamId, thread]);

  if (auth.parsedToken?.sub === relatedSteamId) return null;

  return (
    <>
      <MdBlock
        className={blockStatus ? c.hover_red : c.hover_green}
        onClick={block}
      />
    </>
  );
});
