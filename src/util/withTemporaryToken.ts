import { RootStore, useRootStore } from "@/store";
import Cookies from "cookies";
import * as BrowserCookies from "browser-cookies";
import { AuthStore } from "@/store/AuthStore";
import { NextPageContext } from "next";

export function withTemporaryToken<T>(
  ctx: NextPageContext,
  call: (stores: RootStore) => T,
) {
  let cookies: { get: (key: string) => string | undefined | null };
  // If we are on client, we need to use browser cookies
  if (typeof window === "undefined") {
    // @ts-ignore
    cookies = new Cookies(ctx.req, ctx.res);
  } else {
    cookies = BrowserCookies;
  }
  const token = cookies.get(AuthStore.cookieTokenKey) || undefined;

  const store = useRootStore(undefined);
  store.auth.setToken(token);
  return call(store);
}
