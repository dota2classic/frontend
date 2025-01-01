import { ThreadType } from "@/api/mapped-models";
import {
  querystring,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
} from "@/api/back";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";
import { getApi } from "@/api/hooks";

export const useThread = (
  id: string,
  threadType: ThreadType,
  initialMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO,
  loadLatest: boolean = false,
  page?: number,
  batchSize: number = 100,
): ThreadContainer => {
  const thread = useLocalObservable<ThreadContainer>(
    () => new ThreadContainer(id.toString(), threadType, initialMessages, page),
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages, 0);

  useEffect(() => {
    if (page !== undefined) {
      thread.loadPage(0);
    } else {
      thread.loadMore(loadLatest, batchSize);
    }
  }, [id]);

  useEffect(() => {
    if (page !== undefined) {
      thread.loadPage(page);
    }
  }, [page]);

  return thread;
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
