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
import { useTranslation } from "react-i18next";

interface ILogFileHistoryProps {
  matchId: number;
  steamId: string;
}

type Messages = "all_chat" | "team" | "all";

export const LogFileHistory: React.FC<ILogFileHistoryProps> = observer(
  ({ matchId, steamId }) => {
    const { t } = useTranslation();
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
            {t("log_file_history.onlyAccusedMessages")}
          </Checkbox>
          <SelectOptions
            defaultText={t("log_file_history.messageFilter")}
            onSelect={(e) => setMessageFilter(e.value)}
            selected={messageFilter}
            options={[
              {
                label: t("log_file_history.allMessages"),
                value: "all",
              },
              {
                label: t("log_file_history.allChat"),
                value: "all_chat",
              },
              {
                label: t("log_file_history.teamMessages"),
                value: "team",
              },
            ]}
          />
        </div>
        <div className={c.logList}>
          {isLoading ? (
            t("log_file_history.loading")
          ) : msgs.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>{t("log_file_history.chat")}</th>
                  <th>{t("log_file_history.author")}</th>
                  <th>{t("log_file_history.message")}</th>
                </tr>
              </thead>
              <tbody>
                {msgs.map((msg, idx) => (
                  <tr key={idx}>
                    <td className={msg.allChat ? "bronze" : "green"}>
                      {msg.allChat
                        ? t("log_file_history.toAll")
                        : t("log_file_history.toTeam")}
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
            t("log_file_history.noMessages")
          )}
        </div>
      </Panel>
    );
  },
);
