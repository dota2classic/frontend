import { querystring, RequestOpts } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect, useState } from "react";

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

    console.log("Creating event source, why?", JSON.stringify(endpoint));
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );
    es.onmessage = ({ data: msg }) => {
      const raw = JSON.parse(msg);
      const formatted = transformer(raw);
      setData(formatted);
    };

    return () => es.close();
  }, [context]);

  if (typeof window === "undefined") return initial;

  return data;
};
