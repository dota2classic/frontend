/* eslint-disable */
import { ThreadType } from "@/api/mapped-models";
import {
  querystring,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
} from "@/api/back";
import { useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";
import { getApi } from "@/api/hooks";
import { ThreadInputData } from "@/containers/Thread/ThreadInputData";
import { ThreadContextData } from "@/containers/Thread/threadContext";

export const useThread = (
  id: string,
  threadType: ThreadType,
  initialMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO,
  loadLatest: boolean = false,
  page?: number,
  batchSize: number = 100,
): ThreadContextData => {
  const [value, setValue] = useState("");
  const threadContext = useLocalObservable<ThreadContextData>(() => {
    const thread = new ThreadContainer(
      id.toString(),
      threadType,
      initialMessages,
      page,
    );
    const input = new ThreadInputData(thread);

    return {
      thread,
      input,
    };
  });

  const { thread } = threadContext;

  const [trigger, setTrigger] = useState(0);

  useThreadEventSource(
    id.toString(),
    threadType,
    thread.consumeMessages,
    trigger,
  );

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // We need to load more and re-create event source so that we don't die on thread
      setTrigger((x) => x + 1);
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
    if (page !== undefined) {
      thread.updateThread(threadType, id);
      thread.loadPage(0);
    } else {
      // thread.loadMore(loadLatest, batchSize);
    }
  }, [id, threadType]);

  useEffect(() => {
    if (page !== undefined) {
      thread.loadPage(page, batchSize);
    }
  }, [page]);

  return threadContext;
};

const useThreadEventSource = (
  id: string,
  threadType: ThreadType,
  consumeMessages: (messages: ThreadMessageDTO[]) => void,
  trigger: number = 0,
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
  }, [consumeMessages, context, trigger]);
};
