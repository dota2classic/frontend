import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { parse, stringify } from "qs";
import { useApi } from "@/api/hooks";
import { querystring, RequestOpts } from "@/api/back";
import { numberOrDefault } from "@/util/urls";

const preservedQuery = () => {
  if (typeof window === "undefined") return {};
  else {
    const q = Router.asPath.split("?");
    if (q.length > 1) {
      return parse(q[1]);
    } else {
      return {};
    }
  }
};

export const useQueryParameters = (): Record<string, string> => {
  return useRouter().query as any;
};

export const useQueryBackedParameter = (
  tabName: string = "tab",
): [string | undefined, (a: any) => void] => {
  const router = useRouter();
  const { [tabName]: routerTab } = router.query;

  const setTabAction = (tab?: any) => {
    const href = Router.pathname.split("?")[0];
    const asPath = Router.asPath.split("?")[0];

    // ok we got paths
    // now need to keep query part
    const pQuery = preservedQuery();
    delete pQuery[tabName];
    if (tab !== undefined) {
      pQuery[tabName] = tab.toString();
    }

    const queryPart = stringify(pQuery);

    // Router.push

    // Router.replace(href + `?${queryPart}`, asPath + `?${queryPart}`, {
    router.push(href + `?${queryPart}`, asPath + `?${queryPart}`, {
      // shallow: true,
    });
  };

  return [routerTab as string, setTabAction];
};

export const useRouterChanging = () => {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState<
    [boolean, string | undefined, boolean | undefined]
  >([false, "", false]);
  useEffect(() => {
    const handleRouteChange = (url: string, obj: any) => {
      setIsChanging([true, url, obj.shallow]);
    };

    const handleRouteChangeComplete = (url: string, obj: any) => {
      setIsChanging([false, url, obj.shallow]);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  return isChanging;
};

export const useDidMount = () => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  return mount;
};

export const useEventSource = <T extends {}>(
  endpoint: RequestOpts,
  transformer: (raw: any) => T,
) => {
  if (typeof window === "undefined") return null;
  const bp = useApi().apiParams.basePath;

  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );
    es.onmessage = ({ data: msg }) => {
      const raw = JSON.parse(msg);
      const formatted = transformer(raw);
      setData(formatted);
    };

    return () => es.close();
  }, [JSON.stringify(endpoint)]);

  return data;
};

export const useClampedPage = (
  page: number | string | undefined,
  totalPages: number | undefined,
  setPage: (p: number | string) => void,
) => {
  useEffect(() => {
    if (totalPages !== undefined && numberOrDefault(page, 0) >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [totalPages]);
};

interface TooltipContext2 {
  hovered: HTMLElement;
  item: string;
}

export interface TooltipContextData {
  ctx?: TooltipContext2;
  setCtx: (c?: TooltipContext2) => void;
}

export const TooltipContext = React.createContext<TooltipContextData>(
  {} as any,
);
