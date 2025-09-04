import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { MdBlock } from "react-icons/md";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { ThreadContext } from "@/containers/Thread/threadContext";
import c from "../Message.module.scss";
import { paidAction } from "@/util/subscription";
import { useTranslation } from "react-i18next";
import { Tooltipable } from "@/components/Tooltipable";

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
  const { t } = useTranslation();

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
      <Tooltipable
        className={blockStatus ? c.hover_green : c.hover_red}
        tooltip={t("block_user_tool.tooltip")}
      >
        <MdBlock onClick={block} title={t("block_user_tool.tooltip")} />
      </Tooltipable>
    </>
  );
});
