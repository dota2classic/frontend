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
  initialMessages: ThreadMessageDTO[] = [],
): [Thread, () => void, (messages: ThreadMessageDTO[]) => void] => {
  const threadId = `${threadType}_${id}`;
  const defaultThread = {
    id: threadId,
    messages: initialMessages,
  };

  if (typeof window === "undefined")
    return [defaultThread, () => undefined, () => undefined];
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
      .then(consumeMessages);
  }, [data.messages]);

  // endpoint: RequestOpts,
  //   transformer: (raw: any) => T,

  const endpoint = useApi().forumApi.forumControllerThreadContext({
    id: id.toString(),
    threadType: threadType,
  });

  const consumeMessages = useCallback(
    (msgs: ThreadMessageDTO[]) => {
      setData((d) => {
        let newMessages: ThreadMessageDTO[] = [...d.messages];

        for (let newMessage of msgs) {
          const idx = newMessages.findIndex(
            (m1) => m1.messageId === newMessage.messageId,
          );
          if (idx === -1) {
            // It's a new message, we append
            newMessages.push(newMessage);
          } else {
            // existing, update data
            newMessages[idx] = newMessage;
          }
        }

        return {
          ...data,
          messages: newMessages
            .filter((t) => !t.deleted)
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
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
      consumeMessages([raw]);
    };

    return () => es.close();
  }, [JSON.stringify(endpoint)]);

  return [data, loadMore, consumeMessages];
};
