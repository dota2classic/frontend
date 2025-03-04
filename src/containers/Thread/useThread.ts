/* eslint-disable */
import { ThreadType } from "@/api/mapped-models";
import {
  querystring,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
} from "@/api/back";
import { useEffect, useState } from "react";
import { getApi } from "@/api/hooks";
import { ThreadStore } from "@/store/ThreadStore";

export const useThread = (
  id: string,
  threadType: ThreadType,
): ThreadStore => {
  const [thread] = useState<ThreadStore>(
    () =>
      new ThreadStore(id.toString(), threadType, undefined, undefined),
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages);

  // const handleVisibilityChange = useCallback(() => {
  //   if (!document.hidden) {
  //     // We need to load more and re-create event source so that we don't die on thread
  //     setTrigger((x) => x + 1);
  //     thread.loadNewer();
  //   }
  // }, [thread]);
  //
  // useEffect(() => {
  //   document.addEventListener(
  //     "visibilitychange",
  //     handleVisibilityChange,
  //     false,
  //   );
  //
  //   return () =>
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  // }, [handleVisibilityChange]);

  useEffect(() => {
    thread.updateThread(threadType, id);
  }, [id, threadType]);

  return thread;
};

export const usePaginatedThread = (
  id: string,
  threadType: ThreadType,
  initialMessages: ThreadMessageDTO[] | ThreadMessagePageDTO,
  pagination: {
    page: number;
    perPage?: number;
  },
) => {
  const [thread] = useState<ThreadStore>(
    () =>
      new ThreadStore(
        id.toString(),
        threadType,
        initialMessages,
        pagination.page,
      ),
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages);

  useEffect(() => {
    thread.setInitial(initialMessages);
  }, [initialMessages]);

  // const handleVisibilityChange = useCallback(() => {
  //   if (!document.hidden) {
  //     // We need to load more and re-create event source so that we don't die on thread
  //     setTrigger((x) => x + 1);
  //     thread.loadNewer();
  //   }
  // }, [thread]);
  //
  // useEffect(() => {
  //   document.addEventListener(
  //     "visibilitychange",
  //     handleVisibilityChange,
  //     false,
  //   );
  //
  //   return () =>
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  // }, [handleVisibilityChange]);

  return thread;
};

const useThreadEventSource = (
  id: string,
  threadType: ThreadType,
  consumeMessages: (messages: ThreadMessageDTO[]) => void,
) => {
  const bp = getApi().apiParams.basePath;
  const endpoint = getApi().forumApi.forumControllerThreadContext({
    id: id.toString(),
    threadType: threadType,
  });

  const context = JSON.stringify(endpoint);

  useEffect(() => {
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );

    es.onmessage = ({ data: msg }) => {
      const raw: ThreadMessageDTO = JSON.parse(msg);
      consumeMessages([raw]);
    };

    return () => es.close();
  }, [consumeMessages, context]);
};
