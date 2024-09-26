import { apiInner, useApi } from "@/api/hooks";
import { RootStore, useRootStore, useStore } from "@/store";

export function withTemporaryToken<T>(
  token: string | undefined,
  call: (stores: RootStore) => T,
) {
  const store = useRootStore(undefined);
  store.auth.setToken(token);
  return call(store);
}
