import { useApi } from "@/api/hooks";
import { useCallback, useEffect, useState } from "react";
import { querystring, ThreadMessageDTO } from "@/api/back";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { maxBy } from "@/util/iter";

export interface Thread {
  id: string;
  messages: ThreadMessageDTO[];
}

export const useThread = (
  id: string | number,
  threadType: ThreadType,
): [Thread, () => void] => {
  const threadId = `${threadType}_${id}`;
  const defaultThread = {
    id: threadId,
    messages: [],
  };

  if (typeof window === "undefined") return [defaultThread, () => undefined];
  const bp = useApi().apiParams.basePath;

  const [data, setData] = useState<Thread>(defaultThread);

  const loadMore = useCallback(() => {
    const latest = maxBy(data.messages, (it) =>
      new Date(it.createdAt).getTime(),
    )?.createdAt;
    useApi()
      .forumApi.forumControllerGetMessages(
        id.toString(),
        threadType,
        latest ? new Date(latest).getTime() : undefined,
      )
      .then(appendMessages);
  }, [data.messages]);

  // endpoint: RequestOpts,
  //   transformer: (raw: any) => T,

  const endpoint = useApi().forumApi.forumControllerThreadContext({
    id: id.toString(),
    threadType: threadType,
  });
  const appendMessages = useCallback(
    (msgs: ThreadMessageDTO[]) => {
      setData((d) => {
        const m2 = msgs.filter(
          (t) =>
            d.messages.findIndex((m1) => m1.messageId === t.messageId) === -1,
        );

        return {
          ...data,
          messages: [...d.messages, ...m2].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        };
      });
    },
    [data, data.messages],
  );

  useEffect(() => {
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );

    es.onmessage = ({ data: msg }) => {
      const raw: ThreadMessageDTO = JSON.parse(msg);
      appendMessages([raw]);
    };

    return () => es.close();
  }, [JSON.stringify(endpoint)]);

  return [data, loadMore];
};
