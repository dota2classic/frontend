import { querystring, RequestOpts } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const useEventSource = <T extends object>(
  endpoint: RequestOpts,
  transformer: (raw: object) => T,
  initial: T | null = null,
): T | null => {
  const bp = getApi().apiParams.basePath;

  const [data, setData] = useState<T | null>(initial);

  const context = JSON.stringify(endpoint);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctrl = new AbortController();
    fetchEventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
      {
        headers: endpoint.headers,
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (something) => {
          console.log("onmessage", something);
          if (something.data.length <= 0) return;
          const msg = something.data;
          const raw = JSON.parse(msg);
          const formatted = transformer(raw);
          setData(formatted);
        },
        onclose() {
          // if the server closes the connection unexpectedly, retry:
          console.log("CLOSED?");
        },
        onerror(err) {
          console.error("ERROR", err);
        },
      },
    ).then((a) => console.log("EventSource finished.", a));

    return () => {
      ctrl.abort();
    };
  }, [context]);

  if (typeof window === "undefined") return initial;

  return data;
};
