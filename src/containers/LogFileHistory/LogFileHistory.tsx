import React, { useMemo, useState } from "react";

import c from "./LogFileHistory.module.scss";
import { LogLineDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import {
  Checkbox,
  ForumUserEmbed,
  Panel,
  SelectOptions,
  Table,
} from "@/components";
import { observer } from "mobx-react-lite";

interface ILogFileHistoryProps {
  matchId: number;
  steamId: string;
}

type Messages = "all_chat" | "team" | "all";

export const LogFileHistory: React.FC<ILogFileHistoryProps> = observer(
  ({ matchId, steamId }) => {
    const { data, isLoading } =
      getApi().storageApi.useStorageControllerGetLogMessages(matchId);

    // const { user } = useStore();
    const [messageFilter, setMessageFilter] = useState<Messages>("all");
    const [authorOnly, setAuthorOnly] = useState(false);

    const msgs = useMemo(() => {
      let m: LogLineDto[] = data || [];
      const authorTeam = m.find((t) => t.author === steamId)?.team;

      if (messageFilter === "all_chat") {
        m = m.filter((t) => t.allChat);
      } else if (messageFilter === "team") {
        m = m.filter((t) => !t.allChat && t.team === authorTeam);
      }

      if (authorOnly) {
        m = m.filter((t) => t.author === steamId);
      }

      return m;
    }, [authorOnly, data, messageFilter, steamId]);

    const isEmpty = isLoading || msgs.length === 0;
    return (
      <Panel className={cx(c.log, NotoSans.className, isEmpty && c.empty)}>
        <div className={c.settings}>
          <Checkbox onChange={(e) => setAuthorOnly(e)}>
            Только сообщения обвиняемого
          </Checkbox>
          <SelectOptions
            defaultText={"Фильтр сообщений"}
            onSelect={(e) => setMessageFilter(e.value)}
            selected={messageFilter}
            options={[
              {
                label: "Все сообщения",
                value: "all",
              },
              {
                label: "Общий чат",
                value: "all_chat",
              },
              {
                label: "Командные сообщения",
                value: "team",
              },
            ]}
          />
        </div>
        <div className={c.logList}>
          {isLoading ? (
            "Загрузка..."
          ) : msgs.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Чат</th>
                  <th>Автор</th>
                  <th>Сообщение</th>
                </tr>
              </thead>
              <tbody>
                {msgs.map((msg, idx) => (
                  <tr key={idx}>
                    <td className={msg.allChat ? "bronze" : "green"}>
                      {msg.allChat ? "Всем" : "Команде"}
                    </td>
                    <td>
                      <ForumUserEmbed steamId={msg.author} />
                    </td>
                    <td>{msg.say}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            "Игрок не писал сообщений в чат"
          )}
        </div>
      </Panel>
    );
  },
);
