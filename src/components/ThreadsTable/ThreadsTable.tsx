import React from "react";

import { Table } from "..";

import c from "./ThreadsTable.module.scss";
import { ThreadPageDTO } from "@/api/back";
import { ThreadTableRow } from "@/components/ThreadsTable/ThreadTableRow";
import { useTranslation } from "react-i18next";

interface IThreadsTableProps {
  threads: ThreadPageDTO;
}

export const ThreadsTable: React.FC<IThreadsTableProps> = ({ threads }) => {
  const { t } = useTranslation();

  return (
    <Table className={c.forumTable}>
      <thead>
        <tr>
          <th style={{ width: 20 }}></th>
          {/*<th style={{ width: 10 }}>M</th>*/}
          <th className={c.forumTitle}>{t("threads_table.topic")}</th>
          <th className="omit" style={{ width: 40 }}>
            {t("threads_table.messages")}
          </th>
          <th className="omit" style={{ width: 40 }}>
            {t("threads_table.views")}
          </th>
          <th className="omit" style={{ width: 200 }}>
            {t("threads_table.author")}
          </th>
          <th>{t("threads_table.lastMessage")}</th>
          {/*<th className="omit"></th>*/}
        </tr>
      </thead>
      <tbody>
        {threads.data.map((thread) => (
          <ThreadTableRow
            mutate={() => undefined}
            thread={thread}
            key={thread.id}
          />
        ))}
      </tbody>
    </Table>
  );
};