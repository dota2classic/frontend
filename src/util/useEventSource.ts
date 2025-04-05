import { querystring, RequestOpts } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useCallback, useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const useEventSource = <T extends object>(
  endpoint: RequestOpts,
  transformer: (raw: object) => T,
  initial: T | null = null,
): T | null => {
  const bp = getApi().apiParams.basePath;

  const [trigger, setTrigger] = useState(0);

  const [data, setData] = useState<T | null>(initial);

  const context = JSON.stringify(endpoint);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // We need to load more and re-create event source so that we don't die on thread
      setTrigger((x) => x + 1);
    }
  }, [setTrigger]);

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
    if (typeof window === "undefined") return;

    console.log("Creating event source, why?", JSON.stringify(endpoint));

    const ctrl = new AbortController();
    fetchEventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
      {
        headers: endpoint.headers,

        onmessage: (something) => {
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
    ).then((a) => console.log("Resolved?", a));

    return () => ctrl.abort();
  }, [context, trigger]);

  if (typeof window === "undefined") return initial;

  return data;
};
