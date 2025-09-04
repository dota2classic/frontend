import { getRootStore, RootStore } from "@/store";
import Cookies from "cookies";
import { AuthStore } from "@/store/AuthStore";
import { NextPageContext } from "next";
import { clientStoreManager } from "@/store/ClientStoreManager";

export function withTemporaryToken<T>(
  ctx: NextPageContext,
  call: (stores: RootStore) => T,
) {
  let cookies: { get: (key: string) => string | undefined | null };
  // If we are on client, we need to use browser cookies
  if (typeof window === "undefined") {
    cookies = new Cookies(ctx.req!, ctx.res!);
    const token = cookies.get(AuthStore.cookieTokenKey) || undefined;

    const store = getRootStore(undefined);
    store.auth.setToken(token, false);
    return call(store);
  } else {
    return call(clientStoreManager.getRootStore()!);
  }
}
