// we need to enable static rendering for prevent rerender on server side and leaking memory
import { enableStaticRendering } from "mobx-react-lite";
import { AuthStore } from "./AuthStore";
import { HydratableStore } from "@/store/HydratableStore";
import { useContext } from "react";
import { MobxContext } from "@/pages/_app";
import { QueueStore } from "@/store/queue/QueueStore";
import { getApi } from "@/api/hooks";
import { NotificationStore } from "@/store/NotificationStore";
import { UserCacheStore } from "@/store/UserCacheStore";
import { ThreadsStore } from "@/store/ThreadsStore";

// enable static rendering ONLY on server
enableStaticRendering(typeof window === "undefined");

type InferredHydrationData<T> =
  T extends HydratableStore<infer B> ? B : undefined;

export type HydrateRootData = {
  [prop in keyof RootStore]: InferredHydrationData<RootStore[prop]>;
};

// init a client store that we will send to client (one store for client)
let clientStore: RootStore;

function createStore(): RootStore {
  const auth = new AuthStore();
  const notify = new NotificationStore();
  const queue = new QueueStore(auth, notify);
  const ucache = new UserCacheStore();
  const threads = new ThreadsStore(auth);
  return {
    auth,
    queue,
    notify,
    user: ucache,
    threads,
  };
}
export const __unsafeGetClientStore = () => clientStore;

const initStore = (initData: HydrateRootData | undefined): RootStore => {
  // check if we already declare store (client Store), otherwise create one
  const store = clientStore ?? createStore();
  // hydrate to store if receive initial data
  if (initData) {
    Object.entries(initData).forEach(([storeName, hydrateData]) => {
      const sKey = storeName as keyof RootStore;
      const subStore = store[sKey] as HydratableStore<unknown> | undefined;
      if (!subStore) return;
      subStore.hydrate(hydrateData);
    });
  }

  // Create a store on every server request
  if (typeof window === "undefined") return store;
  // Otherwise it's client, remember this store and return
  if (!clientStore) clientStore = store;

  window.store = clientStore;
  window.api = getApi();
  return store;
};

// Hook for using store
export function getRootStore(initData: HydrateRootData | undefined): RootStore {
  return initStore(initData);
}

export interface RootStore {
  auth: AuthStore;
  queue: QueueStore;
  user: UserCacheStore;
  notify: NotificationStore;
  threads: ThreadsStore;
}

export function useStore(): RootStore {
  return useContext(MobxContext);
}
