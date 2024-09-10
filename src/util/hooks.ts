import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parse, stringify } from "qs";

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


export const useQueryParameter = (name: string): string | undefined => {

}

export const useQueryBackedParameter = (
  tabName: string = "tab"
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

    Router.replace(href + `?${queryPart}`, asPath + `?${queryPart}`, {
      shallow: true,
    })
  };

  return [routerTab, setTabAction];
};


export const useDidMount = () => {

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  return mount;
}
