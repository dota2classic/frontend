import { ThreadType } from "@/api/mapped-models";
import React, { useEffect, useState } from "react";
import { PaginatedThread } from "@/containers/Thread/PaginatedThread";
import { ThreadMessagePageDTO } from "@/api/back";
import { getApi } from "@/api/hooks";

interface Props {
  id: string;
  threadType: ThreadType;
  className?: string;
}
export const LazyPaginatedThread: React.FC<Props> = ({
  id,
  threadType,
  className,
}) => {
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState<ThreadMessagePageDTO | undefined>(
    undefined,
  );

  useEffect(() => {
    getApi()
      .forumApi.forumControllerMessagesPage(id, threadType, page)
      .then(setPageData);
  }, [id, page, threadType]);

  if (!pageData) return null;

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
