import { HTTPHeaders, querystring, RequestOpts } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect, useRef, useState } from "react";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export interface EventSourceOptions {
  enabled?: boolean;
  openWhenHidden?: boolean;
  reconnectOnClose?: boolean;
}

const Retry = {
  BASE_MS: 1_000,
  MAX_MS: 30_000,
  STABLE_MS: 30_000,
} as const;

class StreamRejected extends Error {}

const isTransientStatus = (status: number) =>
  status === 408 || status === 429 || status < 400 || status >= 500;

const retryDelay = (attempt: number) => {
  const ceiling = Math.min(Retry.MAX_MS, Retry.BASE_MS * 2 ** attempt);
  return ceiling / 2 + (Math.random() * ceiling) / 2;
};

const endpointUrl = ({ path, query }: RequestOpts) => {
  const search = query ? querystring(query) : "";
  return `${getApi().basePath}${path}${search && `?${search}`}`;
};

export const useEventSourceListener = (
  endpoint: RequestOpts,
  onMessage: (raw: object) => void,
  {
    enabled = true,
    openWhenHidden = false,
    reconnectOnClose = false,
  }: EventSourceOptions = {},
): void => {
  const url = endpointUrl(endpoint);
  const headersKey = JSON.stringify(endpoint.headers ?? {});
  const handler = useRef(onMessage);

  useEffect(() => {
    handler.current = onMessage;
  });

  useEffect(() => {
    if (!enabled) return;

    const headers: HTTPHeaders = JSON.parse(headersKey);
    let session: { ctrl: AbortController; open: boolean } | undefined;
    let finished = false;

    const canRun = () => openWhenHidden || !document.hidden;

    const stop = () => {
      session?.ctrl.abort();
      session = undefined;
    };

    const start = () => {
      const current = { ctrl: new AbortController(), open: false };
      session = current;
      let attempt = 0;
      let openedAt = 0;

      const settle = () => {
        if (session !== current) return;
        session = undefined;
        finished = true;
      };

      fetchEventSource(url, {
        headers,
        signal: current.ctrl.signal,
        openWhenHidden: true,
        onopen: async (response) => {
          const contentType = response.headers.get("content-type");
          if (response.ok && contentType?.startsWith(EventStreamContentType)) {
            current.open = true;
            openedAt = Date.now();
            return;
          }
          const message = `SSE ${url} answered ${response.status}`;
          throw isTransientStatus(response.status)
            ? new Error(message)
            : new StreamRejected(message);
        },
        onmessage: ({ data }) => {
          if (!data) return;
          try {
            handler.current(JSON.parse(data));
          } catch (e) {
            console.warn(e);
          }
        },
        onclose: () => {
          if (reconnectOnClose) throw new Error(`SSE ${url} closed`);
        },
        onerror: (error) => {
          current.open = false;
          if (error instanceof StreamRejected) throw error;
          if (openedAt && Date.now() - openedAt >= Retry.STABLE_MS) attempt = 0;
          openedAt = 0;
          return retryDelay(attempt++);
        },
      }).then(settle, settle);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (!openWhenHidden) stop();
      } else if (!session && !finished) {
        start();
      }
    };

    const onOnline = () => {
      if (finished || session?.open || !canRun()) return;
      stop();
      start();
    };

    if (canRun()) start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onOnline);
      stop();
    };
  }, [url, headersKey, enabled, openWhenHidden, reconnectOnClose]);
};

export const useEventSource = <T extends object>(
  endpoint: RequestOpts,
  transformer: (raw: object) => T,
  initial: T | null = null,
  options?: EventSourceOptions,
): T | null => {
  const [data, setData] = useState<T | null>(initial);

  useEventSourceListener(endpoint, (raw) => setData(transformer(raw)), options);

  return data;
};
