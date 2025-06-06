import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { MdBlock } from "react-icons/md";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { ThreadContext } from "@/containers/Thread/threadContext";
import c from "../Message.module.scss";
import { paidAction } from "@/util/subscription";

interface Props {
  relatedSteamId: string;
  blockStatus: boolean;
}
export const BlockUserTool = observer(function BlockUserTool({
  relatedSteamId,
  blockStatus,
}: Props) {
  const { auth, sub } = useStore();
  const thread = useContext(ThreadContext);

  const block = useCallback(
    paidAction(async () => {
      if (blockStatus) {
        await getApi().playerApi.playerControllerUnblockPlayer(relatedSteamId);
        thread.setBlockMessagesOf(relatedSteamId, false);
      } else {
        await getApi().playerApi.playerControllerBlockPlayer(relatedSteamId);
        thread.setBlockMessagesOf(relatedSteamId, true);
      }
    }),
    [blockStatus, relatedSteamId, sub, thread],
  );

  if (auth.parsedToken?.sub === relatedSteamId) return null;

  return (
    <>
      <MdBlock
        className={blockStatus ? c.hover_green : c.hover_red}
        onClick={block}
      />
    </>
  );
});
