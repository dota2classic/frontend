import React from "react";

import { Table } from "..";

import c from "./ThreadsTable.module.scss";
import { ThreadPageDTO } from "@/api/back";
import { ThreadMessagePreview } from "@/components/ThreadsTable/ThreadMessagePreview";
import { ThreadTableRow } from "@/components/ThreadsTable/ThreadTableRow";

interface IThreadsTableProps {
  threads: ThreadPageDTO;
}

export const ThreadsTable: React.FC<IThreadsTableProps> = ({ threads }) => {
  return (
    <Table className={c.forumTable}>
      <thead>
        <tr>
          <th style={{ width: 20 }}></th>
          {/*<th style={{ width: 10 }}>M</th>*/}
          <th className={c.forumTitle}>Топик</th>
          <th className="omit" style={{ width: 40 }}>
            Сообщений
          </th>
          <th className="omit" style={{ width: 40 }}>
            Просмотров
          </th>
          <th className="omit" style={{ width: 200 }}>
            Автор
          </th>
          <th>Последнее сообщение</th>
          <th className="omit"></th>
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
