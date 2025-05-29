import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { ThreadMessageDTO } from "@/api/back";
import { GiFist } from "react-icons/gi";
import c from "../Message.module.scss";

interface Props {
  message: ThreadMessageDTO;
}
export const ReportUserTool = observer(function ReportUserTool({
  message,
}: Props) {
  const { auth, report } = useStore();

  const startReport = useCallback(() => {
    report.setReportMeta({ message });
  }, [message, report]);

  if (auth.parsedToken?.sub === message.author.steamId) return null;

  return (
    <>
      <GiFist className={c.hover_red} onClick={startReport} />
    </>
  );
});
