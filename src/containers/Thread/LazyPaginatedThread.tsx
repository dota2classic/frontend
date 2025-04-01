import { ThreadType } from "@/api/mapped-models";
import React, { useEffect, useState } from "react";
import { PaginatedThread } from "@/containers/Thread/PaginatedThread";
import { ThreadMessagePageDTO } from "@/api/back";
import { getApi } from "@/api/hooks";

interface Props {
  id: string;
  threadType: ThreadType;
  className?: string;
  startLatest?: boolean;
}
export const LazyPaginatedThread: React.FC<Props> = ({
  id,
  threadType,
  className,
  startLatest,
}) => {
  const [page, setPage] = useState<undefined | number>(undefined);
  const [pageData, setPageData] = useState<ThreadMessagePageDTO | undefined>(
    undefined,
  );
  useEffect(() => {
    if (startLatest) {
      const api = getApi().forumApi;
      api
        .forumControllerMessagesPage(id, threadType, 0)
        .then((d) => setPage(d.pages - 1));
    } else {
      setPage(0);
    }
  }, [id, threadType, startLatest]);

  useEffect(() => {
    if (page === undefined) return;
    getApi()
      .forumApi.forumControllerMessagesPage(id, threadType, page)
      .then(setPageData);
  }, [id, page, threadType]);

  if (!pageData || page === undefined) return null;

  return (
    <PaginatedThread
      className={className}
      threadType={threadType}
      id={id}
      pagination={{
        page: page,
        pageProvider: (pg) => () => setPage(pg),
      }}
      populateMessages={pageData}
    />
  );
};
