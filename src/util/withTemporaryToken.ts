import { getRootStore, RootStore } from "@/store";
import Cookies from "cookies";
import { NextPageContext } from "next";
import { clientStoreManager } from "@/store/ClientStoreManager";
import { AUTH_TOKEN_COOKIE_KEY } from "@/const/cookie";

export function withTemporaryToken<T>(
  ctx: NextPageContext,
  call: (stores: RootStore) => T,
) {
  let cookies: { get: (key: string) => string | undefined | null };
  // If we are on client, we need to use browser cookies
  if (typeof window === "undefined") {
    cookies = new Cookies(ctx.req!, ctx.res!);
    const token =
      cookies.get(AUTH_TOKEN_COOKIE_KEY) ||
      cookies.get(encodeURIComponent(AUTH_TOKEN_COOKIE_KEY)) ||
      undefined;

    const store = getRootStore(undefined);
    store.auth.setToken(token, false);
    return call(store);
  } else {
    return call(clientStoreManager.getRootStore()!);
  }
}
