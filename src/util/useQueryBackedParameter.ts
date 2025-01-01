import Router, { useRouter } from "next/router";
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
