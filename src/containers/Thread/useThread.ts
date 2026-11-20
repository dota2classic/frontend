/* eslint-disable */
import { ThreadType } from "@/api/mapped-models";
import {
  ThreadMessageDTO,
  ThreadMessageDTOFromJSON,
  ThreadMessagePageDTO,
} from "@/api/back";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApi } from "@/api/hooks";
import { ThreadStore } from "@/store/ThreadStore";
import { useEventSourceListener } from "@/util/useEventSource";

export const useThread = (id: string, threadType: ThreadType): ThreadStore => {
  const [thread] = useState<ThreadStore>(
    () =>
      new ThreadStore(id.toString(), threadType, "fast", undefined, undefined),
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages);

  useEffect(() => thread.start(), [thread]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // We need to load more and re-create event source so that we don't die on thread
      thread.loadNewer();
    }
  }, [thread]);

  useEffect(() => {
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false,
    );

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

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
  const thread = useMemo(
    () =>
      new ThreadStore(
        id.toString(),
        threadType,
        "page",
        initialMessages,
        pagination.page,
      ),
    [id, threadType],
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages);

  useEffect(() => thread.start(), [thread]);

  useEffect(() => {
    thread.setInitial(initialMessages);
  }, [initialMessages]);

  return thread;
};

const useThreadEventSource = (
  id: string,
  threadType: ThreadType,
  consumeMessages: (messages: ThreadMessageDTO[]) => void,
) => {
  useEventSourceListener(
    getApi().forumApi.forumControllerThreadContext({ id, threadType }),
    (raw) => consumeMessages([ThreadMessageDTOFromJSON(raw)]),
    { openWhenHidden: true, reconnectOnClose: true },
  );
};
