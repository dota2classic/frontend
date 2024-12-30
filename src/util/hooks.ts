/* eslint-disable react-hooks/rules-of-hooks */
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { parse, stringify } from "qs";
import { getApi } from "@/api/hooks";
import { EmoticonDto, querystring, RequestOpts, Role } from "@/api/back";
import { numberOrDefault } from "@/util/urls";
import { useStore } from "@/store";

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

export const useIsAdmin = () => {
  const t = useStore().auth.parsedToken;

  return t ? t.roles.includes(Role.ADMIN) : false;
};

export const useQueryParameters = (): Record<string, string> => {
  return useRouter().query as Record<string, string>;
};

export const useQueryBackedParameter = (
  tabName: string = "tab",
): [string | undefined, (a: string | number | undefined) => void] => {
  const router = useRouter();
  const { [tabName]: routerTab } = router.query;

  const setTabAction = (tab?: string | number) => {
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
    const handleRouteChange = (url: string, obj: { shallow: boolean }) => {
      setIsChanging([true, url, obj.shallow]);
    };

    const handleRouteChangeComplete = (
      url: string,
      obj: { shallow: boolean },
    ) => {
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

export const useEventSource = <T extends object>(
  endpoint: RequestOpts,
  transformer: (raw: object) => T,
  initial: T | null = null,
): T | null => {
  if (typeof window === "undefined") return initial;

  const bp = getApi().apiParams.basePath;

  const [data, setData] = useState<T | null>(initial);

  const context = JSON.stringify(endpoint);

  useEffect(() => {
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

  return data;
};

export const useClampedPage = (
  page: number | string | undefined,
  totalPages: number | undefined,
  setPage: (p: number | string) => void,
) => {
  useEffect(() => {
    if (totalPages !== undefined && numberOrDefault(page, 0) >= totalPages) {
      console.log("Clamp", totalPages, page);
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);
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
  {} as TooltipContextData,
);

interface EmoOwner {
  anchor: HTMLElement;
  onSelect: (emo: EmoticonDto) => void;
}
export interface EmoticonTooltipContextData {
  owner?: EmoOwner;
  setOwner: (o: EmoOwner | undefined) => void;
}

export const EmoticonTooltipContext =
  React.createContext<EmoticonTooltipContextData>({
    setOwner: () => undefined,
  });
