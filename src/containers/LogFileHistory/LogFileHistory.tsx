import React, { useMemo } from "react";

import c from "./LogFileHistory.module.scss";
import { LogLineDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { Panel } from "@/components";

interface ILogFileHistoryProps {
  matchId: number;
  steamId: string;
}

export const LogFileHistory: React.FC<ILogFileHistoryProps> = ({
  matchId,
  steamId,
}) => {
  const { data, isLoading } =
    getApi().storageApi.useStorageControllerGetLogMessages(matchId);

  const msgs = useMemo(() => {
    const m: LogLineDto[] = data || [];

    return m.filter((t) => t.author === steamId);
  }, [steamId, data]);

  const isEmpty = isLoading || msgs.length === 0;
  return (
    <Panel className={cx(c.log, NotoSans.className, isEmpty && c.empty)}>
      {isLoading
        ? "Загрузка..."
        : msgs.length > 0
          ? msgs.map((msg, idx) => (
              <div className={c.logEntry} key={idx}>
                <span className={cx(msg.allChat ? "bronze" : "green", c.team)}>
                  {msg.allChat ? "Всем" : "Команде"}:
                </span>{" "}
                {msg.say}
              </div>
            ))
          : "Игрок не писал сообщений в чат"}
    </Panel>
  );
};
