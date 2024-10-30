import {getApi} from "@/api/hooks";
import {useCallback, useEffect, useState} from "react";
import {querystring, ThreadMessageDTO} from "@/api/back";
import {ThreadType} from "@/api/mapped-models/ThreadType";
import {maxBy} from "@/util/iter";

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

  const bp = getApi().apiParams.basePath;

  const [data, setData] = useState<Thread>(defaultThread);

  const consumeMessages = useCallback(
    (msgs: ThreadMessageDTO[]) => {
      setData((d) => {
        const newMessages: ThreadMessageDTO[] = [...d.messages];

        for (const newMessage of msgs) {
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
    [data],
  );


  const loadMore = useCallback(() => {
    const latest = maxBy(data.messages, (it) =>
      new Date(it.createdAt).getTime(),
    )?.createdAt;
    getApi()
      .forumApi.forumControllerGetMessages(
        id.toString(),
        threadType,
        latest ? new Date(latest).getTime() : undefined,
      )
      .then(consumeMessages);
  }, [consumeMessages, data.messages, id, threadType]);



  const endpoint = getApi().forumApi.forumControllerThreadContext({
    id: id.toString(),
    threadType: threadType,
  });

  const context= JSON.stringify(endpoint)
  useEffect(() => {
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );

    es.onmessage = ({ data: msg }) => {
      const raw: ThreadMessageDTO = JSON.parse(msg);
      consumeMessages([raw]);
    };

    return () => es.close();
  }, [bp, consumeMessages, context, endpoint.path, endpoint.query]);


  if (typeof window === "undefined")
    return [defaultThread, () => undefined, () => undefined];

  return [data, loadMore, consumeMessages];
};
