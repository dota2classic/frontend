import React, { useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ThreadMessageDTO } from "@/api/back";
import { GiFist } from "react-icons/gi";
import c from "../Message.module.scss";

import { MessageReportsEnabled } from "@/containers/Thread/threadContext";

interface Props {
  message: ThreadMessageDTO;
}
export const ReportUserTool = observer(function ReportUserTool({
  message,
}: Props) {
  const { auth, report } = useStore();
  const reportsEnabled = useContext(MessageReportsEnabled);

  const startReport = useCallback(() => {
    report.setReportMeta({ message });
  }, [message, report]);

  if (!reportsEnabled || auth.parsedToken?.sub === message.author.steamId) return null;

  return (
    <>
      <GiFist className={c.hover_red} onClick={startReport} />
    </>
  );
});
