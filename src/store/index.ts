// we need to enable static rendering for prevent rerender on server side and leaking memory
import { enableStaticRendering } from "mobx-react-lite";
import { AuthStore } from "./AuthStore";
import { HydratableStore } from "@/store/HydratableStore";
import { useContext } from "react";
import { MobxContext } from "@/pages/_app";
import { QueueStore } from "@/store/queue/QueueStore";
import { useApi } from "@/api/hooks";
import { NotificationStore } from "@/store/NotificationStore";

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
  const queue = new QueueStore(auth, notify, useApi());
  return {
    auth,
    queue,
    notify,
  };
}

const initStore = (initData: HydrateRootData | undefined): RootStore => {
  // check if we already declare store (client Store), otherwise create one
  const store = clientStore ?? createStore();
  // hydrate to store if receive initial data
  if (initData) {
    Object.entries(initData).forEach(([storeName, hydrateData]) => {
      const subStore = store[storeName] as HydratableStore<any> | undefined;
      if (!subStore) return;
      subStore.hydrate(hydrateData);
    });
  }

  // Create a store on every server request
  if (typeof window === "undefined") return store;
  // Otherwise it's client, remember this store and return
  if (!clientStore) clientStore = store;

  // @ts-ignore
  window.store = clientStore;
  return store;
};

// Hook for using store
export function useRootStore(initData): RootStore {
  return initStore(initData);
}

export interface RootStore {
  auth: AuthStore;
  queue: QueueStore;
  notify: NotificationStore;
}

export function useStore(): RootStore {
  return useContext(MobxContext);
}
