// we need to enable static rendering for prevent rerender on server side and leaking memory
import { enableStaticRendering } from "mobx-react-lite";
import { AuthStore } from "./AuthStore";
import { HydratableStore } from "@/store/HydratableStore";
import { useContext } from "react";
import { QueueStore } from "@/store/queue/QueueStore";
import { getApi } from "@/api/hooks";
import { NotificationStore } from "@/store/NotificationStore";
import { UserCacheStore } from "@/store/UserCacheStore";
import { ThreadsStore } from "@/store/ThreadsStore";
import { GreedyFocusStore } from "@/store/GreedyFocusStore";
import { ImageStore } from "@/store/ImageStore";
import { LiveStore } from "@/store/LiveStore";
import { ReportStore } from "@/store/ReportStore";
import { ClaimItemStore } from "@/store/ClaimItemStore";
import { MobxContext } from "@/store/MobxContext";
import { SubStore } from "@/store/SubStore";
import { clientStoreManager } from "./ClientStoreManager";
import Cookies from "js-cookie";

// enable static rendering ONLY on server
enableStaticRendering(typeof window === "undefined");

type InferredHydrationData<T> =
  T extends HydratableStore<infer B> ? B : undefined;

export type HydrateRootData = Partial<{
  [prop in keyof RootStore]: InferredHydrationData<RootStore[prop]>;
}>;

// init a client store that we will send to client (one store for client)
function createStore(): RootStore {
  const auth = new AuthStore();
  const notify = new NotificationStore(auth);
  const queue = new QueueStore(auth, notify);
  const ucache = new UserCacheStore();
  const threads = new ThreadsStore(auth);
  return {
    auth,
    queue,
    notify,
    live: new LiveStore(),
    user: ucache,
    threads,
    greedyFocus: new GreedyFocusStore(),
    image: new ImageStore(),
    report: new ReportStore(),
    claim: new ClaimItemStore(),
    sub: new SubStore(),
  };
}

const initStore = (initData: HydrateRootData | undefined): RootStore => {
  // check if we already declare store (client Store), otherwise create one
  const store = clientStoreManager.getRootStore() ?? createStore();
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
  if (!clientStoreManager.getRootStore()) {
    clientStoreManager.setRootStore(store);
  }

  window.store = clientStoreManager.getRootStore() as RootStore;
  window.api = getApi();
  window.cook = Cookies;
  return store;
};

export function getRootStore(initData: HydrateRootData | undefined): RootStore {
  return initStore(initData);
}

export interface RootStore {
  auth: AuthStore;
  queue: QueueStore;
  user: UserCacheStore;
  notify: NotificationStore;
  live: LiveStore;
  threads: ThreadsStore;
  greedyFocus: GreedyFocusStore;
  image: ImageStore;
  report: ReportStore;
  claim: ClaimItemStore;
  sub: SubStore;
}

export function useStore(): RootStore {
  return useContext(MobxContext);
}
